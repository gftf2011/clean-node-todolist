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

describe('Mutation - createNote', () => {
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

  it('should return 200 when note is created', async () => {
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

    const { body } = await serverRequest(signUpQuery);
    const token = body.data.signUp.accessToken;

    const response = await serverRequest(createNoteQuery, token);

    expect(response.status).toBe(200);
    expect(response.body.data.createNote).toHaveProperty('id');
    expect(response.body.data.createNote).toHaveProperty('finished');
    expect(response.body.data.createNote).toHaveProperty('timestamp');
    expect(response.body.data.createNote.title).toBe('any title');
    expect(response.body.data.createNote.description).toBe('any description');
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

    const { body } = await serverRequest(signUpQuery);
    const token = body.data.signUp.accessToken;

    await sleep(5000);

    const response = await serverRequest(createNoteQuery, token);

    const error = new TokenExpiredError();

    expect(response.status).toBe(401);
    expect(response.body.data.createNote).toBeNull();
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
