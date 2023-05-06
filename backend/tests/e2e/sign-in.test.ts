import '../../src/main/bootstrap';

import request, { Response } from 'supertest';

import { loader } from '../../src/main/loaders';
import server from '../../src/main/config/server';

import { UserDTO } from '../../src/domain/dto';

import {
  MissingBodyParamsError,
  UserDoesNotExistsError,
  PasswordDoesNotMatchError,
} from '../../src/app/errors';

import { DatabaseTransaction } from '../../src/app/contracts/database';

import { PostgresTransaction } from '../../src/infra/database/postgres';

describe('POST - api/V1/sign-in', () => {
  let postgres: DatabaseTransaction;

  const closeAllConnections = async (): Promise<void> => {
    await postgres.close();
  };

  const signUpRequest = async (user: UserDTO): Promise<Response> => {
    const response = await request(server).post('/api/V1/sign-up').send(user);
    return response;
  };

  const signInRequest = async (
    email: string,
    password: string,
  ): Promise<Response> => {
    const response = await request(server)
      .post('/api/V1/sign-in')
      .send({ email, password });
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

    postgres = new PostgresTransaction();
  });

  it('should return 200 with a valid user', async () => {
    const user = {
      email: 'test@mail.com',
      password: '12345678xX@',
      name: 'test',
      lastname: 'test',
    };

    await signUpRequest(user);
    const response = await signInRequest(user.email, user.password);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });

  it('should return 400 if email is empty', async () => {
    const account = {
      email: '',
      password: '12345678xX@',
    };

    const response = await signInRequest(account.email, account.password);

    const error = new MissingBodyParamsError(['email']);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: error.message,
      name: error.name,
    });
  });

  it('should return 400 if password is empty', async () => {
    const account = {
      email: 'test@mail.com',
      password: '',
    };

    const response = await signInRequest(account.email, account.password);

    const error = new MissingBodyParamsError(['password']);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: error.message,
      name: error.name,
    });
  });

  it('should return 401 if user does not exists', async () => {
    const account = {
      email: 'test@mail.com',
      password: '12345678xX@',
    };

    const response = await signInRequest(account.email, account.password);

    const error = new UserDoesNotExistsError();

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      message: error.message,
      name: error.name,
    });
  });

  it('should return 403 if user password does not match', async () => {
    const user = {
      email: 'test@mail.com',
      password: '12345678xX@',
      name: 'test',
      lastname: 'test',
    };
    const otherPassword = '12345678xX$';

    await signUpRequest(user);
    const response = await signInRequest(user.email, otherPassword);

    const error = new PasswordDoesNotMatchError();

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      message: error.message,
      name: error.name,
    });
  });

  afterEach(async () => {
    await cleanAllUsers();
  });

  afterAll(async () => {
    await closeAllConnections();
  });
});
