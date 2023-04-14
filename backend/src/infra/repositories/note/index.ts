/* eslint-disable max-classes-per-file */
import { NoteRepository } from '../../../domain/repositories';
import { NoteModel } from '../../../domain/models';

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

  constructor() {
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

export enum NOTE_REPOSITORIES_FACTORIES {
  NOTE_FAKE_LOCAL = 'NOTE_FAKE_LOCAL',
}

export class NoteRepositoryFactory {
  private fakeLocalRepository: FakeLocalNoteRepositoryCreator;

  private static instance: NoteRepositoryFactory;

  private constructor() {}

  public static initialize(): NoteRepositoryFactory {
    if (!this.instance) {
      this.instance = new NoteRepositoryFactory();
    }
    return this.instance;
  }

  // eslint-disable-next-line consistent-return
  public make(factoryType: NOTE_REPOSITORIES_FACTORIES): NoteRepository {
    if (factoryType === NOTE_REPOSITORIES_FACTORIES.NOTE_FAKE_LOCAL) {
      if (!this.fakeLocalRepository) {
        this.fakeLocalRepository = new FakeLocalNoteRepositoryCreator();
      }
      return this.fakeLocalRepository;
    }
  }
}
