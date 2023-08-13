import '../../../src/main/bootstrap';

import request, { Response } from 'supertest';

import { loader } from '../../../src/main/loaders';
import serverApp from '../../../src/main/config/server';

import { NoteDTO, UserDTO } from '../../../src/domain/dto';

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

describe('PUT - api/V1/update-note', () => {
  let postgres: DatabaseTransaction;
  let server: any;

  const closeAllConnections = async (): Promise<void> => {
    await postgres.close();
  };

  const signUpRequest = async (user: UserDTO): Promise<Response> => {
    const response = await request(server).post('/api/V1/sign-up').send(user);
    return response;
  };

  const createNoteRequest = async (
    note: NoteDTO,
    token: string,
  ): Promise<Response> => {
    const response = await request(server)
      .post('/api/V1/create-note')
      .set('Authorization', `${token}`)
      .send(note);
    return response;
  };

  const getNotesRequest = async (
    data: { page: number; limit: number },
    token: string,
  ): Promise<Response> => {
    const response = await request(server)
      .get('/api/V1/find-notes')
      .set('Authorization', `${token}`)
      .set('page', `${data.page}`)
      .set('limit', `${data.limit}`)
      .send();
    return response;
  };

  const updateNoteRequest = async (
    data: NoteDTO,
    token: string,
  ): Promise<Response> => {
    const response = await request(server)
      .put('/api/V1/update-note')
      .set('Authorization', `${token}`)
      .send(data);
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
    const user: UserDTO = {
      email: 'test@mail.com',
      password: '12345678xX@',
      name: 'test',
      lastname: 'test',
    };

    const note: NoteDTO = {
      title: 'any title',
      description: 'any description',
    };

    const { body } = await signUpRequest(user);
    const token = body.accessToken;

    await createNoteRequest(note, token);

    const getNotesResponse = await getNotesRequest(
      { page: 0, limit: 10 },
      token,
    );
    const { notes } = getNotesResponse.body.paginatedNotes;

    const updateNoteResponse = await updateNoteRequest(
      {
        id: notes[0].id,
        title: 'any title 2',
        description: 'any description 2',
      },
      token,
    );

    expect(updateNoteResponse.status).toBe(200);
    expect(updateNoteResponse.body).toHaveProperty('id');
    expect(updateNoteResponse.body).toHaveProperty('finished');
    expect(updateNoteResponse.body).toHaveProperty('timestamp');
    expect(updateNoteResponse.body.title).toBe('any title 2');
    expect(updateNoteResponse.body.description).toBe('any description 2');
  });

  it('should return 400 if note is not found', async () => {
    const user: UserDTO = {
      email: 'test@mail.com',
      password: '12345678xX@',
      name: 'test',
      lastname: 'test',
    };

    const { body } = await signUpRequest(user);
    const token = body.accessToken;

    const response = await updateNoteRequest(
      {
        id: 'any-id',
        title: 'any title 2',
        description: 'any description 2',
      },
      token,
    );

    const error = new NoteNotFoundError('any-id');

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: error.message,
      name: error.name,
    });
  });

  it('should return 401 if token expires', async () => {
    const user: UserDTO = {
      email: 'test@mail.com',
      password: '12345678xX@',
      name: 'test',
      lastname: 'test',
    };

    const note: NoteDTO = {
      title: 'any title',
      description: 'any description',
    };

    const { body } = await signUpRequest(user);
    const token = body.accessToken;

    await createNoteRequest(note, token);

    const getNotesResponse = await getNotesRequest(
      { page: 0, limit: 10 },
      token,
    );
    const { notes } = getNotesResponse.body.paginatedNotes;

    await sleep(5000);

    const response = await updateNoteRequest(
      {
        id: notes[0].id,
        title: 'any title 2',
        description: 'any description 2',
      },
      token,
    );

    const error = new TokenExpiredError();

    expect(response.status).toBe(401);
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
