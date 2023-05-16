import '../../../src/main/bootstrap';

import request, { Response } from 'supertest';

import { loader } from '../../../src/main/loaders';
import serverApp from '../../../src/main/config/server';

import {
  InvalidEmailError,
  InvalidLastnameError,
  InvalidNameError,
  WeakPasswordError,
} from '../../../src/domain/errors';

import { DatabaseTransaction } from '../../../src/app/contracts/database';
import { UserAlreadyExistsError } from '../../../src/app/errors';

import { PostgresTransaction } from '../../../src/infra/database/postgres';

describe('signUp - Mutation', () => {
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

  it('should return 200 with a valid user', async () => {
    const query = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    const response = await serverRequest(query);

    expect(response.status).toBe(200);
    expect(response.body.data.signUp.accessToken).toBeDefined();
  });

  it('should return 400 if email is white space string', async () => {
    const query = `mutation {
      signUp (input: { email: " ", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    const response = await serverRequest(query);

    const error = new InvalidEmailError(' ');

    expect(response.status).toBe(400);
    expect(response.body.data.signUp).toBeNull();
    expect(response.body.errors[0].message).toBe(error.message);
    expect(response.body.errors[0].extensions.message).toBe(error.message);
    expect(response.body.errors[0].extensions.name).toBe(error.name);
  });

  it('should return 400 if password is white space string', async () => {
    const query = `mutation {
      signUp (input: { email: "test@mail.com", password: " ", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    const response = await serverRequest(query);

    const error = new WeakPasswordError();

    expect(response.status).toBe(400);
    expect(response.body.data.signUp).toBeNull();
    expect(response.body.errors[0].message).toBe(error.message);
    expect(response.body.errors[0].extensions.message).toBe(error.message);
    expect(response.body.errors[0].extensions.name).toBe(error.name);
  });

  it('should return 400 if name is white space string', async () => {
    const query = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: " ", lastname: "test" }) {
        accessToken
      }
    }`;

    const response = await serverRequest(query);

    const error = new InvalidNameError(' ');

    expect(response.status).toBe(400);
    expect(response.body.data.signUp).toBeNull();
    expect(response.body.errors[0].message).toBe(error.message);
    expect(response.body.errors[0].extensions.message).toBe(error.message);
    expect(response.body.errors[0].extensions.name).toBe(error.name);
  });

  it('should return 400 if lastname is white space string', async () => {
    const query = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: " " }) {
        accessToken
      }
    }`;

    const response = await serverRequest(query);

    const error = new InvalidLastnameError(' ');

    expect(response.status).toBe(400);
    expect(response.body.data.signUp).toBeNull();
    expect(response.body.errors[0].message).toBe(error.message);
    expect(response.body.errors[0].extensions.message).toBe(error.message);
    expect(response.body.errors[0].extensions.name).toBe(error.name);
  });

  it('should return 403 if user already exists', async () => {
    const query = `mutation {
      signUp (input: { email: "test@mail.com", password: "12345678xX@", name: "test", lastname: "test" }) {
        accessToken
      }
    }`;

    await serverRequest(query);
    const response = await serverRequest(query);

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
