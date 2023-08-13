import '../../../src/main/bootstrap';

import request, { Response } from 'supertest';

import { loader } from '../../../src/main/loaders';
import serverApp from '../../../src/main/config/server';

import {
  TokenExpiredError,
  NoteNotFoundError,
  UnfinishedNoteError,
} from '../../../src/app/errors';
import { DatabaseTransaction } from '../../../src/app/contracts/database';

import { PostgresTransaction } from '../../../src/infra/database/postgres';

const sleep = (timeout: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

describe('Mutation - deleteNote', () => {
  let postgres: DatabaseTransaction;
  let server: any;

  const closeAllConnections = async (): Promise<void> => {
    await postgres.close();
  };

  const serverRequest = async (
    query: string,
    token?: string,
  ): Promise<Response> => {
    const response = await request(server)
      .post('/graphql')
      .set('Authorization', `${token}`)
      .send({ query });
    return response;
  };

  const cleanAllUsers = async (): Promise<void> => {
    await postgres.createClient();
    await postgres.openTransaction();
    await postgres.query({
      queryText: 'DELETE FROM users_schema.users',
      values: [],
    });
    await postgres.commit();
    await postgres.closeTransaction();
  };

  beforeAll(async () => {
    await loader();
    server = await serverApp();

    postgres = new PostgresTransaction();
  });

  it('should return 200 when note is deleted', async () => {
    const signUpQuery = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    const createNoteQuery = `mutation {
      createNote (input: { title: "any title", description: "any description" }) {
        id
        title
        description
        timestamp
        finished
      }
    }`;

    const getNotesQuery = `query {
      getNotesByUserId (input: { page: ${0}, limit: ${10} }) {
        paginatedNotes {
          notes {
            id
            title
            description
            timestamp
            finished
          }
          previous
          next
        }
      }
    }`;

    const { body } = await serverRequest(signUpQuery);
    const token = body.data.signUp.accessToken;

    await serverRequest(createNoteQuery, token);

    const getNotesResponse = await serverRequest(getNotesQuery, token);
    const { notes } =
      getNotesResponse.body.data.getNotesByUserId.paginatedNotes;

    const updateFinishedNoteQuery = `mutation {
      updateFinishedNote (input: { id: "${notes[0].id}", finished: true }) {
        id
        title
        description
        timestamp
        finished
      }
    }`;

    const deleteNoteQuery = `mutation {
      deleteNote (input: { id: "${notes[0].id}" })
    }`;

    await serverRequest(updateFinishedNoteQuery, token);

    const deleteNoteResponse = await serverRequest(deleteNoteQuery, token);

    const getNotesResponse2 = await serverRequest(getNotesQuery, token);

    expect(deleteNoteResponse.status).toBe(200);
    expect(
      getNotesResponse2.body.data.getNotesByUserId.paginatedNotes.notes.length,
    ).toBe(0);
  });

  it('should return 400 if note is not found', async () => {
    const signUpQuery = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    const { body } = await serverRequest(signUpQuery);
    const token = body.data.signUp.accessToken;

    const deleteNoteQuery = `mutation {
      deleteNote (input: { id: "any-id" })
    }`;

    const response = await serverRequest(deleteNoteQuery, token);

    const error = new NoteNotFoundError('any-id');

    expect(response.status).toBe(400);
    expect(response.body.data.deleteNote).toBeNull();
    expect(response.body.errors[0].message).toBe(error.message);
    expect(response.body.errors[0].extensions.message).toBe(error.message);
    expect(response.body.errors[0].extensions.name).toBe(error.name);
  });

  it('should return 400 if note is not finished', async () => {
    const signUpQuery = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    const createNoteQuery = `mutation {
      createNote (input: { title: "any title", description: "any description" }) {
        id
        title
        description
        timestamp
        finished
      }
    }`;

    const getNotesQuery = `query {
      getNotesByUserId (input: { page: ${0}, limit: ${10} }) {
        paginatedNotes {
          notes {
            id
            title
            description
            timestamp
            finished
          }
          previous
          next
        }
      }
    }`;

    const { body } = await serverRequest(signUpQuery);
    const token = body.data.signUp.accessToken;

    await serverRequest(createNoteQuery, token);

    const getNotesResponse = await serverRequest(getNotesQuery, token);
    const { notes } =
      getNotesResponse.body.data.getNotesByUserId.paginatedNotes;

    const deleteNoteQuery = `mutation {
      deleteNote (input: { id: "${notes[0].id}" })
    }`;

    const response = await serverRequest(deleteNoteQuery, token);

    const error = new UnfinishedNoteError(notes[0].id);

    expect(response.status).toBe(400);
    expect(response.body.data.deleteNote).toBeNull();
    expect(response.body.errors[0].message).toBe(error.message);
    expect(response.body.errors[0].extensions.message).toBe(error.message);
    expect(response.body.errors[0].extensions.name).toBe(error.name);
  });

  it('should return 401 if token expires', async () => {
    const signUpQuery = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    const createNoteQuery = `mutation {
      createNote (input: { title: "any title", description: "any description" }) {
        id
        title
        description
        timestamp
        finished
      }
    }`;

    const getNotesQuery = `query {
      getNotesByUserId (input: { page: ${0}, limit: ${10} }) {
        paginatedNotes {
          notes {
            id
            title
            description
            timestamp
            finished
          }
          previous
          next
        }
      }
    }`;

    const { body } = await serverRequest(signUpQuery);
    const token = body.data.signUp.accessToken;

    await serverRequest(createNoteQuery, token);

    const getNotesResponse = await serverRequest(getNotesQuery, token);
    const { notes } =
      getNotesResponse.body.data.getNotesByUserId.paginatedNotes;

    const updateFinishedNoteQuery = `mutation {
      updateFinishedNote (input: { id: "${notes[0].id}", finished: true })
    }`;

    const deleteNoteQuery = `mutation {
      deleteNote (input: { id: "${notes[0].id}" })
    }`;

    await serverRequest(updateFinishedNoteQuery, token);

    await sleep(5000);

    const response = await serverRequest(deleteNoteQuery, token);

    const error = new TokenExpiredError();

    expect(response.status).toBe(401);
    expect(response.body.data.deleteNote).toBeNull();
    expect(response.body.errors[0].message).toBe(error.message);
    expect(response.body.errors[0].extensions.message).toBe(error.message);
    expect(response.body.errors[0].extensions.name).toBe(error.name);
  });

  afterEach(async () => {
    await cleanAllUsers();
  });

  afterAll(async () => {
    await closeAllConnections();
  });
});
