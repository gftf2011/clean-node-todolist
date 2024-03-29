import '../../../src/main/bootstrap';

import request, { Response } from 'supertest';

import { loader } from '../../../src/main/loaders';
import serverApp from '../../../src/main/config/server';

import { NoteDTO, UserDTO } from '../../../src/domain/dto';

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

describe('GET - api/V1/find-notes', () => {
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

  it('should return 200 when notes are found and pagination has no previous OR next page', async () => {
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

    const response = await getNotesRequest({ page: 0, limit: 1 }, token);

    expect(response.status).toBe(200);
    expect(response.body.paginatedNotes.notes.length).toBe(1);
    expect(response.body.paginatedNotes.previous).toBeFalsy();
    expect(response.body.paginatedNotes.next).toBeFalsy();
  });

  it('should return 200 when notes are found and pagination has no previous but has next page', async () => {
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
    await createNoteRequest(note, token);

    const response = await getNotesRequest({ page: 0, limit: 1 }, token);

    expect(response.status).toBe(200);
    expect(response.body.paginatedNotes.notes.length).toBe(1);
    expect(response.body.paginatedNotes.previous).toBeFalsy();
    expect(response.body.paginatedNotes.next).toBeTruthy();
  });

  it('should return 200 when notes are found and pagination has previous but has no next page', async () => {
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
    await createNoteRequest(note, token);

    const response = await getNotesRequest({ page: 1, limit: 1 }, token);

    expect(response.status).toBe(200);
    expect(response.body.paginatedNotes.notes.length).toBe(1);
    expect(response.body.paginatedNotes.previous).toBeTruthy();
    expect(response.body.paginatedNotes.next).toBeFalsy();
  });

  it('should return 200 when notes are found and pagination has previous and has next page', async () => {
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
    await createNoteRequest(note, token);
    await createNoteRequest(note, token);

    const response = await getNotesRequest({ page: 1, limit: 1 }, token);

    expect(response.status).toBe(200);
    expect(response.body.paginatedNotes.notes.length).toBe(1);
    expect(response.body.paginatedNotes.previous).toBeTruthy();
    expect(response.body.paginatedNotes.next).toBeTruthy();
  });

  it('should return 200 when notes are not found', async () => {
    const user: UserDTO = {
      email: 'test@mail.com',
      password: '12345678xX@',
      name: 'test',
      lastname: 'test',
    };

    const { body } = await signUpRequest(user);
    const token = body.accessToken;

    const response = await getNotesRequest({ page: 0, limit: 10 }, token);

    expect(response.status).toBe(200);
    expect(response.body.paginatedNotes.notes.length).toBe(0);
    expect(response.body.paginatedNotes.previous).toBeFalsy();
    expect(response.body.paginatedNotes.next).toBeFalsy();
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

    await sleep(5000);

    const response = await getNotesRequest({ page: 0, limit: 10 }, token);

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
