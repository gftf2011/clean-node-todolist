import '../../src/main/bootstrap';

import request, { Response } from 'supertest';

import { loader } from '../../src/main/loaders';
import server from '../../src/main/config/server';

import {
  InvalidEmailError,
  InvalidLastnameError,
  InvalidNameError,
  WeakPasswordError,
} from '../../src/domain/errors';
import { UserDTO } from '../../src/domain/dto';

import {
  MissingBodyParamsError,
  UserAlreadyExistsError,
} from '../../src/app/errors';
import { DatabaseTransaction } from '../../src/app/contracts/database';

import { PostgresTransaction } from '../../src/infra/database/postgres';

describe('POST - api/V1/sign-up', () => {
  let postgres: DatabaseTransaction;

  const closeAllConnections = async (): Promise<void> => {
    await postgres.close();
  };

  const signUpRequest = async (user: UserDTO): Promise<Response> => {
    const response = await request(server).post('/api/V1/sign-up').send(user);
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

  it('should return 201 with a valid user', async () => {
    const user = {
      email: 'test@mail.com',
      password: '12345678xX@',
      name: 'test',
      lastname: 'test',
    };

    const response = await signUpRequest(user);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
  });

  it('should return 400 if email is empty', async () => {
    const user = {
      email: '',
      password: '12345678xX@',
      name: 'test',
      lastname: 'test',
    };

    const response = await signUpRequest(user);

    const error = new MissingBodyParamsError(['email']);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: error.message,
      name: error.name,
    });
  });

  it('should return 400 if password is empty', async () => {
    const user = {
      email: 'test@mail.com',
      password: '',
      name: 'test',
      lastname: 'test',
    };

    const response = await signUpRequest(user);

    const error = new MissingBodyParamsError(['password']);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: error.message,
      name: error.name,
    });
  });

  it('should return 400 if name is empty', async () => {
    const user = {
      email: 'test@mail.com',
      password: '12345678xX@',
      name: '',
      lastname: 'test',
    };

    const response = await signUpRequest(user);

    const error = new MissingBodyParamsError(['name']);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: error.message,
      name: error.name,
    });
  });

  it('should return 400 if lastname is empty', async () => {
    const user = {
      email: 'test@mail.com',
      password: '12345678xX@',
      name: 'test',
      lastname: '',
    };

    const response = await signUpRequest(user);

    const error = new MissingBodyParamsError(['lastname']);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: error.message,
      name: error.name,
    });
  });

  it('should return 400 if email is invalid', async () => {
    const invalidEmail = 'test@mail..com';

    const user = {
      email: invalidEmail,
      password: '12345678xX@',
      name: 'test',
      lastname: 'test',
    };

    const response = await signUpRequest(user);

    const error = new InvalidEmailError(invalidEmail);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: error.message,
      name: error.name,
    });
  });

  it('should return 400 if password is weak', async () => {
    const weakPassword = '123456';

    const user = {
      email: 'test@mail.com',
      password: weakPassword,
      name: 'test',
      lastname: 'test',
    };

    const response = await signUpRequest(user);

    const error = new WeakPasswordError();

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: error.message,
      name: error.name,
    });
  });

  it('should return 400 if name is invalid', async () => {
    const invalidName = ' ';

    const user = {
      email: 'test@mail.com',
      password: '12345678xX@',
      name: invalidName,
      lastname: 'test',
    };

    const response = await signUpRequest(user);

    const error = new InvalidNameError(invalidName);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: error.message,
      name: error.name,
    });
  });

  it('should return 400 if lastname is invalid', async () => {
    const invalidLastname = ' ';

    const user = {
      email: 'test@mail.com',
      password: '12345678xX@',
      name: 'test',
      lastname: invalidLastname,
    };

    const response = await signUpRequest(user);

    const error = new InvalidLastnameError(invalidLastname);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: error.message,
      name: error.name,
    });
  });

  it('should return 403 id user already exists', async () => {
    const user = {
      email: 'test@mail.com',
      password: '12345678xX@',
      name: 'test',
      lastname: 'test',
    };

    await signUpRequest(user);
    const response = await signUpRequest(user);

    const error = new UserAlreadyExistsError();

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
