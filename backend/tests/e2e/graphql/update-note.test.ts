import '../../../src/main/bootstrap';

import request, { Response } from 'supertest';

import { loader } from '../../../src/main/loaders';
import serverApp from '../../../src/main/config/server';

import { TokenExpiredError, NoteNotFoundError } from '../../../src/app/errors';
import { DatabaseTransaction } from '../../../src/app/contracts/database';

import { PostgresTransaction } from '../../../src/infra/database/postgres';

const sleep = (timeout: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

describe('updateNote - Mutation', () => {
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

  it('should return 200 when note is updated', async () => {
    const signUpQuery = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    const createNoteQuery = `mutation {
      createNote (input: { title: "any title", description: "any description" }) {
        created
      }
    }`;

    const getNotesQuery = `query {
      getNotesByUserId (input: { page: ${0}, limit: ${10} }) {
        notes {
          id
          title
          description
          timestamp
          finished
        }
      }
    }`;

    const { body } = await serverRequest(signUpQuery);
    const token = body.data.signUp.accessToken;

    await serverRequest(createNoteQuery, token);

    const getNotesResponse = await serverRequest(getNotesQuery, token);
    const { notes } = getNotesResponse.body.data.getNotesByUserId;

    const updateNoteQuery = `mutation {
      updateNote (input: { id: "${notes[0].id}", title: "any title 2", description: "any description 2" })
    }`;

    const getNoteQuery = `query {
      getNote (input: { id: "${notes[0].id}" }) {
        id
        title
        description
        timestamp
        finished
      }
    }`;

    const updateNoteResponse = await serverRequest(updateNoteQuery, token);

    const singleNoteResponse = await serverRequest(getNoteQuery, token);

    expect(updateNoteResponse.status).toBe(200);
    expect(singleNoteResponse.body.data.getNote.title).toBe('any title 2');
    expect(singleNoteResponse.body.data.getNote.description).toBe(
      'any description 2',
    );
  });

  it('should return 400 if note is not found', async () => {
    const signUpQuery = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    const { body } = await serverRequest(signUpQuery);
    const token = body.data.signUp.accessToken;

    const updateNoteQuery = `mutation {
      updateNote (input: { id: "any-id", title: "any title 2", description: "any description 2" })
    }`;

    const response = await serverRequest(updateNoteQuery, token);

    const error = new NoteNotFoundError('any-id');

    expect(response.status).toBe(400);
    expect(response.body.data.updateNote).toBeNull();
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
        created
      }
    }`;

    const getNotesQuery = `query {
      getNotesByUserId (input: { page: ${0}, limit: ${10} }) {
        notes {
          id
          title
          description
          timestamp
          finished
        }
      }
    }`;

    const { body } = await serverRequest(signUpQuery);
    const token = body.data.signUp.accessToken;

    await serverRequest(createNoteQuery, token);

    const getNotesResponse = await serverRequest(getNotesQuery, token);
    const { notes } = getNotesResponse.body.data.getNotesByUserId;

    const updateNoteQuery = `mutation {
      updateNote (input: { id: "${notes[0].id}", title: "any title", description: "any description" })
    }`;

    await sleep(5000);

    const response = await serverRequest(updateNoteQuery, token);

    const error = new TokenExpiredError();

    expect(response.status).toBe(401);
    expect(response.body.data.updateNote).toBeNull();
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
