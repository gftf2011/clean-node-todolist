import '../../../src/main/bootstrap';

import request, { Response } from 'supertest';

import { loader } from '../../../src/main/loaders';
import serverApp from '../../../src/main/config/server';

import { TokenExpiredError } from '../../../src/app/errors';

import { DatabaseTransaction } from '../../../src/app/contracts/database';

import { PostgresTransaction } from '../../../src/infra/database/postgres';

const sleep = (timeout: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

describe('getNotesByUserId - Query', () => {
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

  it('should return 200 when notes are found', async () => {
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

    const response = await serverRequest(getNotesQuery, token);

    expect(response.status).toBe(200);
    expect(
      response.body.data.getNotesByUserId.notes.length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('should return 200 when notes are not found', async () => {
    const signUpQuery = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
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

    const response = await serverRequest(getNotesQuery, token);

    expect(response.status).toBe(200);
    expect(
      response.body.data.getNotesByUserId.notes.length,
    ).toBeGreaterThanOrEqual(0);
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

    await sleep(5000);

    const response = await serverRequest(getNotesQuery, token);

    const error = new TokenExpiredError();

    expect(response.status).toBe(401);
    expect(response.body.data.getNotesByUserId).toBeNull();
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
