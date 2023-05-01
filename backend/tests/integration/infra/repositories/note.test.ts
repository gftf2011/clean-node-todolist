import '../../../../src/main/bootstrap';

import faker from 'faker';

import { loader } from '../../../../src/main/loaders';

import { NoteModel, UserModel } from '../../../../src/domain/models';

import { DatabaseTransaction } from '../../../../src/app/contracts/database';

import { PostgresTransaction } from '../../../../src/infra/database/postgres';
import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../src/infra/repositories';

describe('Note - Repository', () => {
  let postgres: DatabaseTransaction;

  beforeAll(async () => {
    await loader();

    postgres = new PostgresTransaction();
  });

  it('should return note if exists', async () => {
    const user: UserModel = {
      id: faker.datatype.uuid(),
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    const note: NoteModel = {
      id: faker.datatype.uuid(),
      title: faker.lorem.word(),
      description: faker.lorem.word(),
      finished: false,
      userId: user.id,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const noteRepository = factory.createNoteRepository();
    const userRepository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    await userRepository.save(user);
    await noteRepository.save(note);

    const response = await noteRepository.find(note.id);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toStrictEqual(note);
  });

  it('should NOT return note if do NOT exists', async () => {
    const note: NoteModel = {
      id: faker.datatype.uuid(),
      title: faker.lorem.word(),
      description: faker.lorem.word(),
      finished: false,
      userId: faker.datatype.uuid(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const noteRepository = factory.createNoteRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    const response = await noteRepository.find(note.id);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toBeUndefined();
  });

  it('should return all notes from pagination', async () => {
    const user: UserModel = {
      id: faker.datatype.uuid(),
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    const notes: NoteModel[] = [
      {
        id: faker.datatype.uuid(),
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: user.id,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: faker.datatype.uuid(),
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: user.id,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: faker.datatype.uuid(),
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: user.id,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const noteRepository = factory.createNoteRepository();
    const userRepository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    await userRepository.save(user);
    // eslint-disable-next-line no-restricted-syntax
    for (const note of notes) {
      await noteRepository.save(note);
    }

    const limit = notes.length;
    const page = 0;
    const response = await noteRepository.findAll(page, limit);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response.length).toEqual(notes.length);
  });

  it('should return empty array notes from pagination', async () => {
    const user: UserModel = {
      id: faker.datatype.uuid(),
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    const notes: NoteModel[] = [
      {
        id: faker.datatype.uuid(),
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: user.id,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: faker.datatype.uuid(),
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: user.id,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: faker.datatype.uuid(),
        title: faker.lorem.word(),
        description: faker.lorem.word(),
        finished: false,
        userId: user.id,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const noteRepository = factory.createNoteRepository();
    const userRepository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    await userRepository.save(user);
    // eslint-disable-next-line no-restricted-syntax
    for (const note of notes) {
      await noteRepository.save(note);
    }

    const limit = notes.length;
    const page = 1;
    const response = await noteRepository.findAll(page, limit);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toStrictEqual([]);
  });

  it('should return all notes by user id from pagination', async () => {
    try {
      const user: UserModel = {
        id: faker.datatype.uuid(),
        email: faker.internet.email().toLowerCase(),
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      };

      const notes: NoteModel[] = [
        {
          id: faker.datatype.uuid(),
          title: faker.lorem.word(),
          description: faker.lorem.word(),
          finished: false,
          userId: user.id,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: faker.datatype.uuid(),
          title: faker.lorem.word(),
          description: faker.lorem.word(),
          finished: false,
          userId: user.id,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: faker.datatype.uuid(),
          title: faker.lorem.word(),
          description: faker.lorem.word(),
          finished: false,
          userId: user.id,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];

      const factory = new RepositoriesConcreteFactory(postgres).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const noteRepository = factory.createNoteRepository();
      const userRepository = factory.createUserRepository();

      await postgres.createClient();
      await postgres.openTransaction();

      await userRepository.save(user);
      // eslint-disable-next-line no-restricted-syntax
      for (const note of notes) {
        await noteRepository.save(note);
      }

      const limit = notes.length;
      const page = 0;
      const response = await noteRepository.findNotesByUserId(
        user.id,
        page,
        limit,
      );

      await postgres.commit();
      await postgres.closeTransaction();

      expect(response.length).toEqual(notes.length);
    } catch (error) {
      console.log(error);
    }
  });

  it('should return updated note', async () => {
    const user: UserModel = {
      id: faker.datatype.uuid(),
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    const note: NoteModel = {
      id: faker.datatype.uuid(),
      title: 'title-1',
      description: 'description-1',
      finished: false,
      userId: user.id,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const noteRepository = factory.createNoteRepository();
    const userRepository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    await userRepository.save(user);
    await noteRepository.save(note);
    await noteRepository.update({
      ...note,
      title: 'title-2',
      description: 'description-2',
    });
    const response = await noteRepository.find(note.id);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toStrictEqual({
      ...note,
      title: 'title-2',
      description: 'description-2',
    });
  });

  it('should return updated finished status note', async () => {
    const user: UserModel = {
      id: faker.datatype.uuid(),
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    const note: NoteModel = {
      id: faker.datatype.uuid(),
      title: faker.lorem.word(),
      description: faker.lorem.word(),
      finished: false,
      userId: user.id,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const timestamp = new Date().toISOString();

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const noteRepository = factory.createNoteRepository();
    const userRepository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    await userRepository.save(user);
    await noteRepository.save(note);
    await noteRepository.updateFinishedNote(note.id, true, timestamp);
    const response = await noteRepository.find(note.id);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toStrictEqual({
      ...note,
      finished: true,
      updatedAt: timestamp,
    });
  });

  it('should delete note', async () => {
    const user: UserModel = {
      id: faker.datatype.uuid(),
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    const note: NoteModel = {
      id: faker.datatype.uuid(),
      title: faker.lorem.word(),
      description: faker.lorem.word(),
      finished: false,
      userId: user.id,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const noteRepository = factory.createNoteRepository();
    const userRepository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    await userRepository.save(user);
    await noteRepository.save(note);
    await noteRepository.delete(note.id);
    const response = await noteRepository.find(note.id);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toBeUndefined();
  });

  it('should delete note if user is deleted', async () => {
    const user: UserModel = {
      id: faker.datatype.uuid(),
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    const note: NoteModel = {
      id: faker.datatype.uuid(),
      title: faker.lorem.word(),
      description: faker.lorem.word(),
      finished: false,
      userId: user.id,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const noteRepository = factory.createNoteRepository();
    const userRepository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    await userRepository.save(user);
    await noteRepository.save(note);

    await userRepository.delete(user.id);

    const response = await noteRepository.find(note.id);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toBeUndefined();
  });

  afterEach(async () => {
    await postgres.createClient();
    await postgres.openTransaction();
    await postgres.query({
      queryText: 'DELETE FROM users_schema.users',
      values: [],
    });
    await postgres.query({
      queryText: 'DELETE FROM notes_schema.notes',
      values: [],
    });
    await postgres.commit();
    await postgres.closeTransaction();
  });

  afterAll(async () => {
    await postgres.close();
  });
});
