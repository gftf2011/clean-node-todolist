/* eslint-disable max-classes-per-file */
import { NoteRepository } from '../../../domain/repositories';
import { NoteModel } from '../../../domain/models';
import { DatabaseQuery } from '../../../app/contracts/database';

type Rows = {
  rows: NoteModel[];
};

class RemoteNoteRepositoryProduct implements NoteRepository {
  constructor(private readonly query: DatabaseQuery) {}

  async find(id: string): Promise<NoteModel> {
    const queryText = 'SELECT * FROM notes_schema.notes WHERE id = $1';

    const values: any[] = [id];

    const input = {
      queryText,
      values,
    };

    const response = (await this.query.query(input)) as Rows;

    const parsedResponse: NoteModel = response.rows[0]
      ? {
          createdAt: response.rows[0].createdAt,
          description: response.rows[0].description,
          finished: response.rows[0].finished,
          id: response.rows[0].id,
          title: response.rows[0].title,
          updatedAt: response.rows[0].updatedAt,
          userId: response.rows[0].userId,
        }
      : undefined;
    return parsedResponse;
  }

  async findNotesByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<NoteModel[]> {
    const queryText =
      'SELECT * FROM notes_schema.notes ORDER BY id LIMIT $1 OFFSET $2 WHERE userId = $3';

    const values: any[] = [limit, limit * page, userId];

    const input = {
      queryText,
      values,
    };

    const response = (await this.query.query(input)) as Rows;

    const parsedResponse: NoteModel[] = response.rows[0]
      ? response.rows.map(item => ({
          createdAt: item.createdAt,
          description: item.description,
          finished: item.finished,
          id: item.id,
          title: item.title,
          updatedAt: item.updatedAt,
          userId: item.userId,
        }))
      : [];
    return parsedResponse;
  }

  async findAll(page: number, limit: number): Promise<NoteModel[]> {
    const queryText =
      'SELECT * FROM notes_schema.notes ORDER BY id LIMIT $1 OFFSET $2';

    const values: any[] = [limit, limit * page];

    const input = {
      queryText,
      values,
    };

    const response = (await this.query.query(input)) as Rows;

    const parsedResponse: NoteModel[] = response.rows[0]
      ? response.rows.map(item => ({
          createdAt: item.createdAt,
          description: item.description,
          finished: item.finished,
          id: item.id,
          title: item.title,
          updatedAt: item.updatedAt,
          userId: item.userId,
        }))
      : [];
    return parsedResponse;
  }

  async save(note: NoteModel): Promise<void> {
    const queryText =
      'INSERT INTO notes_schema.notes(id, title, description, finished, createdAt, updatedAt, userId) VALUES($1, $2, $3, $4, $5, $6, $7)';

    const values: any[] = [
      note.id,
      note.title,
      note.description,
      note.finished,
      note.createdAt,
      note.updatedAt,
      note.userId,
    ];

    const input = {
      queryText,
      values,
    };

    await this.query.query(input);
  }

  async update(noteUpdated: NoteModel): Promise<void> {
    const queryText =
      'UPDATE notes_schema.notes SET id = $1, title = $2, description = $3, finished = $4, updatedAt = $5 WHERE id = $1';

    const values: any[] = [
      noteUpdated.id,
      noteUpdated.title,
      noteUpdated.description,
      noteUpdated.finished,
      noteUpdated.updatedAt,
    ];

    const input = {
      queryText,
      values,
    };

    await this.query.query(input);
  }

  async delete(id: string): Promise<void> {
    const queryText = 'DELETE FROM notes_schema.notes WHERE id = $1';

    const values: any[] = [id];

    const input = {
      queryText,
      values,
    };

    await this.query.query(input);
  }
}

class FakeLocalNoteRepositoryProduct implements NoteRepository {
  private notes: NoteModel[] = [];

  async find(id: string): Promise<NoteModel> {
    return this.notes.find(note => note.id === id);
  }

  async findNotesByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<NoteModel[]> {
    const filteredNotes = this.notes.filter(note => note.userId === userId);

    return filteredNotes.slice((page - 1) * limit, page * limit);
  }

  async findAll(page: number, limit: number): Promise<NoteModel[]> {
    return this.notes.slice((page - 1) * limit, page * limit);
  }

  async save(note: NoteModel): Promise<void> {
    this.notes.push(note);
  }

  async update(noteUpdated: NoteModel): Promise<void> {
    this.notes.forEach((note: NoteModel, index: number, array: NoteModel[]) => {
      if (note.id === noteUpdated.id) {
        // eslint-disable-next-line no-param-reassign
        array[index] = noteUpdated;
      }
    });
  }

  async delete(id: string): Promise<void> {
    this.notes = this.notes.filter(note => note.id === id);
  }
}

abstract class NoteRepositoryCreator implements NoteRepository {
  private product: NoteRepository;

  constructor(protected readonly query?: DatabaseQuery) {
    this.product = this.factoryMethod();
  }

  protected abstract factoryMethod(): NoteRepository;

  public async findNotesByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<NoteModel[]> {
    return this.product.findNotesByUserId(userId, page, limit);
  }

  public async save(value: NoteModel): Promise<void> {
    await this.product.save(value);
  }

  public async update(value: NoteModel): Promise<void> {
    await this.product.update(value);
  }

  public async delete(id: string): Promise<void> {
    await this.product.delete(id);
  }

  public async find(id: string): Promise<NoteModel> {
    return this.product.find(id);
  }

  public async findAll(page: number, limit: number): Promise<NoteModel[]> {
    return this.product.findAll(page, limit);
  }
}

class FakeLocalNoteRepositoryCreator extends NoteRepositoryCreator {
  protected factoryMethod(): NoteRepository {
    return new FakeLocalNoteRepositoryProduct();
  }
}

class RemoteNoteRepositoryCreator extends NoteRepositoryCreator {
  protected factoryMethod(): NoteRepository {
    return new RemoteNoteRepositoryProduct(this.query);
  }
}

export enum NOTE_REPOSITORIES_FACTORIES {
  NOTE_FAKE_LOCAL = 'NOTE_FAKE_LOCAL',
  NOTE_REMOTE = 'NOTE_REMOTE',
}

export class NoteRepositoryFactory {
  private repository: NoteRepositoryCreator;

  private static instance: NoteRepositoryFactory;

  private constructor(private readonly query: DatabaseQuery) {}

  public static initialize(query: DatabaseQuery): NoteRepositoryFactory {
    if (!this.instance) {
      this.instance = new NoteRepositoryFactory(query);
    }
    return this.instance;
  }

  // eslint-disable-next-line consistent-return
  public make(factoryType: NOTE_REPOSITORIES_FACTORIES): NoteRepository {
    if (factoryType === NOTE_REPOSITORIES_FACTORIES.NOTE_FAKE_LOCAL) {
      this.repository = new FakeLocalNoteRepositoryCreator();
    }
    if (factoryType === NOTE_REPOSITORIES_FACTORIES.NOTE_REMOTE) {
      this.repository = new RemoteNoteRepositoryCreator(this.query);
    }
    return this.repository;
  }
}