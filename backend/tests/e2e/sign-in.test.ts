import '../../src/main/bootstrap';

import request, { Response } from 'supertest';

import { loader } from '../../src/main/loaders';
import server from '../../src/main/config/server';

import { UserDTO } from '../../src/domain/dto';

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

  afterEach(async () => {
    await cleanAllUsers();
  });

  afterAll(async () => {
    await closeAllConnections();
  });
});
