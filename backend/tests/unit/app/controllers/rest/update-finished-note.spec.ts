import { UserDTO } from '../../../../../src/domain/dto';
import { HttpRequest } from '../../../../../src/app/contracts/http';
import { UpdateFinishedNoteHttpController } from '../../../../../src/app/controllers/rest';
import {
  MissingBodyParamsError,
  MissingHeaderParamsError,
  UserDoesNotExistsError,
} from '../../../../../src/app/errors';
import {
  badRequest,
  noContent,
  unknown,
  unauthorized,
} from '../../../../../src/app/controllers/utils';

import { NoteServiceDummy } from '../../../../doubles/dummies/app/services/note';
import { UserServiceDummy } from '../../../../doubles/dummies/app/services/user';

import { NoteServiceStub } from '../../../../doubles/stubs/app/services/note';
import { UserServiceStub } from '../../../../doubles/stubs/app/services/user';

describe('Update Finished Note - HTTP Controller', () => {
  it('should throw "MissingHeaderParamsError" if userId is "undefined"', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new UpdateFinishedNoteHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: {},
      body: { id: noteID, finished: true },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['userId'])),
    );
  });

  it('should throw "MissingHeaderParamsError" if userId is "null"', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new UpdateFinishedNoteHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: { userId: null },
      body: { id: noteID, finished: true },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['userId'])),
    );
  });

  it('should throw "MissingHeaderParamsError" if userId is empty string', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new UpdateFinishedNoteHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: { userId: '' },
      body: { id: noteID, finished: true },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['userId'])),
    );
  });

  it('should throw "MissingBodyParamsError" if id is "undefined"', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new UpdateFinishedNoteHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: { userId: userID },
      body: { finished: true },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['id'])),
    );
  });

  it('should throw "MissingBodyParamsError" if id is "null"', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new UpdateFinishedNoteHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: { userId: userID },
      body: { id: null, finished: true },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['id'])),
    );
  });

  it('should throw "MissingBodyParamsError" if id is empty string', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new UpdateFinishedNoteHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: { userId: userID },
      body: { id: '', finished: true },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['id'])),
    );
  });

  it('should throw "MissingBodyParamsError" if finished is "undefined"', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new UpdateFinishedNoteHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: { userId: userID },
      body: { id: noteID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['finished'])),
    );
  });

  it('should throw "MissingBodyParamsError" if finished is "null"', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new UpdateFinishedNoteHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: { userId: userID },
      body: { id: noteID, finished: null },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['finished'])),
    );
  });

  it('should throw "UserDoesNotExistsError" user do not exists in database', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(null)],
    });
    const noteService = new NoteServiceDummy();
    const controller = new UpdateFinishedNoteHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: { userId: userID },
      body: { id: noteID, finished: true },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(unauthorized(new UserDoesNotExistsError()));
  });

  it('should return "unknown" status by unpredicted response', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.reject(new Error('unknown'))],
    });
    const noteService = new NoteServiceDummy();
    const controller = new UpdateFinishedNoteHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: { userId: userID },
      body: { id: noteID, finished: true },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(unknown(new Error('unknown')));
  });

  it('should update note finished status', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const user: UserDTO = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
      id: userID,
    };

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(user)],
    });
    const noteService = new NoteServiceStub({
      updateFinishedNote: [Promise.resolve()],
    });
    const controller = new UpdateFinishedNoteHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: { userId: userID },
      body: { id: noteID, finished: true },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(noContent());
  });
});
