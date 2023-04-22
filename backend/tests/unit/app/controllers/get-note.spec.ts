import { NoteDTO, UserDTO } from '../../../../src/domain/dto';
import { NoteViewModel } from '../../../../src/app/controllers/view-models';
import { HttpRequest } from '../../../../src/app/contracts/http';
import { GetNoteController } from '../../../../src/app/controllers';
import {
  MissingUrlParamsError,
  MissingHeaderParamsError,
  UserDoesNotExistsError,
  NoteNotFoundError,
} from '../../../../src/app/errors';
import {
  badRequest,
  ok,
  unauthorized,
  unknown,
} from '../../../../src/app/controllers/utils';

import { NoteServiceDummy } from '../../../doubles/dummies/app/services/note';
import { UserServiceDummy } from '../../../doubles/dummies/app/services/user';

import { NoteServiceStub } from '../../../doubles/stubs/app/services/note';
import { UserServiceStub } from '../../../doubles/stubs/app/services/user';

describe('Get Note - Controller', () => {
  it('should throw "MissingHeaderParamsError" if userId do not exists', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new GetNoteController(noteService, userService);

    const request: HttpRequest = {
      headers: {},
      params: { id: noteID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['userId'])),
    );
  });

  it('should throw "MissingUrlParamsError" if id do not exists', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new GetNoteController(noteService, userService);

    const request: HttpRequest = {
      headers: { userId: userID },
      params: {},
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingUrlParamsError(['id'])),
    );
  });

  it('should throw "UserDoesNotExistsError" user do not exists in database', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(null)],
    });
    const noteService = new NoteServiceDummy();
    const controller = new GetNoteController(noteService, userService);

    const request: HttpRequest = {
      headers: { userId: userID },
      params: { id: noteID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(unauthorized(new UserDoesNotExistsError()));
  });

  it('should throw "NoteNotFoundError" if note do not exists in database', async () => {
    const user: UserDTO = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
      id: 'id_mock',
    };

    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(user)],
    });
    const noteService = new NoteServiceStub({
      getNote: [Promise.resolve(null)],
    });
    const controller = new GetNoteController(noteService, userService);

    const request: HttpRequest = {
      headers: { userId: userID },
      params: { id: noteID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(badRequest(new NoteNotFoundError(noteID)));
  });

  it('should return "unknown" status by unpredicted response', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.reject(new Error('unknown'))],
    });
    const noteService = new NoteServiceDummy();
    const controller = new GetNoteController(noteService, userService);

    const request: HttpRequest = {
      headers: { userId: userID },
      params: { id: noteID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(unknown(new Error('unknown')));
  });

  it('should get note', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const user: UserDTO = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
      id: userID,
    };

    const note: NoteDTO = {
      id: noteID,
      title: 'title_mock',
      description: 'description_mock',
      finished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(user)],
    });
    const noteService = new NoteServiceStub({
      getNote: [Promise.resolve(note)],
    });
    const controller = new GetNoteController(noteService, userService);

    const request: HttpRequest = {
      headers: { userId: userID },
      params: { id: noteID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(ok(NoteViewModel.map(note)));
  });
});
