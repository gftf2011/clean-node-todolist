import '../../../src/main/bootstrap';

import request, { Response } from 'supertest';

import { loader } from '../../../src/main/loaders';
import serverApp from '../../../src/main/config/server';

import { DatabaseTransaction } from '../../../src/app/contracts/database';
import { UserAlreadyExistsError } from '../../../src/app/errors';

import { PostgresTransaction } from '../../../src/infra/database/postgres';

describe('signUp - Mutation', () => {
  let postgres: DatabaseTransaction;
  let server: any;

  const closeAllConnections = async (): Promise<void> => {
    await postgres.close();
  };

  const signUpRequest = async (query: string): Promise<Response> => {
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

  it('should return 201 with a valid user', async () => {
    const query = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    const response = await signUpRequest(query);

    expect(response.status).toBe(200);
    expect(response.body.data.signUp.accessToken).toBeDefined();
  });

  it('should return 403 id user already exists', async () => {
    const query = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    await signUpRequest(query);
    const response = await signUpRequest(query);

    const error = new UserAlreadyExistsError();

    expect(response.status).toBe(403);
    expect(response.body.data.signUp).toBeNull();
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
