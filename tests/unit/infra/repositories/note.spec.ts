import faker from 'faker';

import { NoteModel } from '../../../../src/domain/models';
import { NoteRepository } from '../../../../src/domain/repositories';

import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../src/infra/repositories';

import { PostgresConnectionSpy } from '../../../doubles/spies/infra/database/postgres/connection';

describe('Note - Repository', () => {
  describe('Local', () => {
    let repository: NoteRepository;

    beforeAll(() => {
      const factory = new RepositoriesConcreteFactory({} as any).make(
        REPOSITORIES_FACTORIES.LOCAL,
      );
      repository = factory.createNoteRepository();
    });

    it('should return note if exists', async () => {
      const note: NoteModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.save(note);

      const response = await repository.find(note.id);

      expect(response).toStrictEqual(note);
    });

    it('should NOT return note if do NOT exists', async () => {
      const id = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(31)}1`;
      const note: NoteModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.save(note);

      const response = await repository.find(id);

      expect(response).toBeUndefined();
    });

    it('should return notes by user id if exists', async () => {
      const userId = `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`;
      const notes = [
        {
          id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
          title: faker.lorem.word(),
          description: faker.lorem.word(),
          finished: false,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
          title: faker.lorem.word(),
          description: faker.lorem.word(),
          finished: false,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const mappedNotes: NoteModel[] = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const note of notes) {
        const mappedNote: NoteModel = {
          createdAt: note.created_at,
          description: note.description,
          finished: note.finished,
          id: note.id,
          title: note.title,
          updatedAt: note.updated_at,
          userId: note.user_id,
        };
        mappedNotes.push(mappedNote);
        await repository.save(mappedNote);
      }

      const limit = 2;
      const page = 1;
      const response = await repository.findNotesByUserId(userId, page, limit);

      expect(response).toStrictEqual(mappedNotes);
    });

    it('should return empty notes array if user id do NOT exists', async () => {
      const userId = `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`;
      const notes: NoteModel[] = [
        {
          id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
          title: faker.lorem.word(),
          description: faker.lorem.word(),
          finished: false,
          userId: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
          title: faker.lorem.word(),
          description: faker.lorem.word(),
          finished: false,
          userId: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const note of notes) {
        await repository.save(note);
      }

      const limit = 2;
      const page = 1;
      const response = await repository.findNotesByUserId(userId, page, limit);

      expect(response).toStrictEqual([]);
    });

    it('should return all notes from pagination', async () => {
      const notes: NoteModel[] = [
        {
          id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
          title: faker.lorem.word(),
          description: faker.lorem.word(),
          finished: false,
          userId: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
          title: faker.lorem.word(),
          description: faker.lorem.word(),
          finished: false,
          userId: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const note of notes) {
        await repository.save(note);
      }

      const response = await repository.findAll(1, 2);

      expect(response).toStrictEqual(notes);
    });

    it('should return updated note', async () => {
      const note: NoteModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        title: 'title1',
        description: faker.lorem.word(),
        finished: false,
        userId: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.save(note);
      await repository.update({ ...note, title: 'title2' });

      const response = await repository.find(note.id);

      expect(response).toStrictEqual({ ...note, title: 'title2' });
    });

    it('should return updated note to finished', async () => {
      const note: NoteModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = new Date().toISOString();

      await repository.save(note);
      await repository.updateFinishedNote(note.id, true, updated);

      const response = await repository.find(note.id);

      expect(response).toStrictEqual({
        ...note,
        finished: true,
        updatedAt: updated,
      });
    });

    it('should delete note', async () => {
      const note: NoteModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repository.save(note);
      await repository.delete(note.id);

      const response = await repository.find(note.id);

      expect(response).toBeUndefined();
    });

    afterEach(async () => {
      const notes = await repository.findAll(1, 10);
      // eslint-disable-next-line no-restricted-syntax
      for (const note of notes) {
        await repository.delete(note.id);
      }
    });
  });

  describe('Remote', () => {
    it('should return note if exists', async () => {
      const note = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        user_id: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const spy = new PostgresConnectionSpy([
        Promise.resolve({ rows: [note] }),
      ]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createNoteRepository();

      const response = await repository.find(note.id);

      const mappedNote: NoteModel = {
        id: note.id,
        title: note.title,
        description: note.description,
        finished: note.finished,
        userId: note.user_id,
        createdAt: note.created_at,
        updatedAt: note.updated_at,
      };

      expect(response).toStrictEqual(mappedNote);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'SELECT * FROM notes_schema.notes WHERE id = $1',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([note.id]);
    });

    it('should NOT return note if do NOT exists', async () => {
      const note: NoteModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const spy = new PostgresConnectionSpy([Promise.resolve({ rows: [] })]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createNoteRepository();

      const response = await repository.find(note.id);

      expect(response).toBeUndefined();

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'SELECT * FROM notes_schema.notes WHERE id = $1',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([note.id]);
    });

    it('should return notes by user id if exists', async () => {
      const userId = `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`;
      const notes = [
        {
          id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
          title: faker.lorem.word(),
          description: faker.lorem.word(),
          finished: false,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
          title: faker.lorem.word(),
          description: faker.lorem.word(),
          finished: false,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const spy = new PostgresConnectionSpy([Promise.resolve({ rows: notes })]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createNoteRepository();

      const limit = 2;
      const page = 1;
      const response = await repository.findNotesByUserId(userId, page, limit);

      const mappedNotes: NoteModel[] = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const note of notes) {
        mappedNotes.push({
          id: note.id,
          title: note.title,
          description: note.description,
          finished: note.finished,
          userId: note.user_id,
          createdAt: note.created_at,
          updatedAt: note.updated_at,
        });
      }

      expect(response).toStrictEqual(mappedNotes);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'SELECT * FROM notes_schema.notes WHERE user_id = $3 ORDER BY id LIMIT $1 OFFSET $2',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([
        limit,
        limit * page,
        userId,
      ]);
    });

    it('should return empty notes array if user id do NOT exists', async () => {
      const userId = `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`;

      const spy = new PostgresConnectionSpy([Promise.resolve({ rows: [] })]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createNoteRepository();

      const limit = 2;
      const page = 1;
      const response = await repository.findNotesByUserId(userId, page, limit);

      expect(response).toStrictEqual([]);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'SELECT * FROM notes_schema.notes WHERE user_id = $3 ORDER BY id LIMIT $1 OFFSET $2',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([
        limit,
        limit * page,
        userId,
      ]);
    });

    it('should return all notes from pagination', async () => {
      const notes = [
        {
          id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
          title: faker.lorem.word(),
          description: faker.lorem.word(),
          finished: false,
          user_id: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
          title: faker.lorem.word(),
          description: faker.lorem.word(),
          finished: false,
          user_id: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const spy = new PostgresConnectionSpy([Promise.resolve({ rows: notes })]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createNoteRepository();

      const limit = 2;
      const page = 1;
      const response = await repository.findAll(page, limit);

      const mappedNotes: NoteModel[] = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const note of notes) {
        mappedNotes.push({
          id: note.id,
          title: note.title,
          description: note.description,
          finished: note.finished,
          userId: note.user_id,
          createdAt: note.created_at,
          updatedAt: note.updated_at,
        });
      }

      expect(response).toStrictEqual(mappedNotes);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'SELECT * FROM notes_schema.notes ORDER BY id LIMIT $1 OFFSET $2',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([
        limit,
        limit * page,
      ]);
    });

    it('should return empty array if no notes were found', async () => {
      const spy = new PostgresConnectionSpy([Promise.resolve({ rows: [] })]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createNoteRepository();

      const limit = 2;
      const page = 1;
      const response = await repository.findAll(page, limit);

      expect(response).toStrictEqual([]);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'SELECT * FROM notes_schema.notes ORDER BY id LIMIT $1 OFFSET $2',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([
        limit,
        limit * page,
      ]);
    });

    it('should save note', async () => {
      const note: NoteModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const spy = new PostgresConnectionSpy([Promise.resolve()]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createNoteRepository();

      await repository.save(note);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'INSERT INTO notes_schema.notes(id, title, description, finished, created_at, updated_at, user_id) VALUES($1, $2, $3, $4, $5, $6, $7)',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([
        note.id,
        note.title,
        note.description,
        note.finished,
        note.createdAt,
        note.updatedAt,
        note.userId,
      ]);
    });

    it('should return updated note', async () => {
      const note: NoteModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const spy = new PostgresConnectionSpy([Promise.resolve()]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createNoteRepository();

      await repository.update(note);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'UPDATE notes_schema.notes SET title = $2, description = $3, updated_at = $4 WHERE id = $1',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([
        note.id,
        note.title,
        note.description,
        note.updatedAt,
      ]);
    });

    it('should return updated note to finished', async () => {
      const note: NoteModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: `${'1'.repeat(17)}-${'1'.repeat(32)}-${'1'.repeat(32)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const spy = new PostgresConnectionSpy([Promise.resolve()]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createNoteRepository();

      await repository.updateFinishedNote(
        note.id,
        note.finished,
        note.updatedAt,
      );

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'UPDATE notes_schema.notes SET finished = $2, updated_at = $3 WHERE id = $1',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([
        note.id,
        note.finished,
        note.updatedAt,
      ]);
    });

    it('should delete note', async () => {
      const noteId = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

      const spy = new PostgresConnectionSpy([Promise.resolve()]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createNoteRepository();

      await repository.delete(noteId);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'DELETE FROM notes_schema.notes WHERE id = $1',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([noteId]);
    });
  });
});
