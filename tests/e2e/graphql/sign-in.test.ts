import '../../../src/main/bootstrap';

import request, { Response } from 'supertest';

import { loader } from '../../../src/main/loaders';
import serverApp from '../../../src/main/config/server';

import { DatabaseTransaction } from '../../../src/app/contracts/database';
import {
  PasswordDoesNotMatchError,
  UserDoesNotExistsError,
} from '../../../src/app/errors';

import { PostgresTransaction } from '../../../src/infra/database/postgres';

describe('signIn - Query', () => {
  let postgres: DatabaseTransaction;
  let server: any;

  const closeAllConnections = async (): Promise<void> => {
    await postgres.close();
  };

  const serverRequest = async (query: string): Promise<Response> => {
    const response = await request(server).post('/graphql').send({ query });
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

  it('should return 200 with a valid account', async () => {
    const signUpQuery = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    const signInQuery = `query {
      signIn (input: { email: "test@mail.com", password: "12345678xX@" }) {
        accessToken
      }
    }`;

    await serverRequest(signUpQuery);
    const response = await serverRequest(signInQuery);

    expect(response.status).toBe(200);
    expect(response.body.data.signIn.accessToken).toBeDefined();
  });

  it('should return 401 if user does not exists', async () => {
    const signInQuery = `query {
      signIn (input: { email: "test@mail.com", password: "12345678xX@" }) {
        accessToken
      }
    }`;

    const response = await serverRequest(signInQuery);

    const error = new UserDoesNotExistsError();

    expect(response.status).toBe(401);
    expect(response.body.data.signIn).toBeNull();
    expect(response.body.errors[0].message).toBe(error.message);
    expect(response.body.errors[0].extensions.message).toBe(error.message);
    expect(response.body.errors[0].extensions.name).toBe(error.name);
  });

  it('should return 403 if user password does not match', async () => {
    const signUpQuery = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    const signInQuery = `query {
      signIn (input: { email: "test@mail.com", password: " " }) {
        accessToken
      }
    }`;

    await serverRequest(signUpQuery);
    const response = await serverRequest(signInQuery);

    const error = new PasswordDoesNotMatchError();

    expect(response.status).toBe(403);
    expect(response.body.data.signIn).toBeNull();
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
