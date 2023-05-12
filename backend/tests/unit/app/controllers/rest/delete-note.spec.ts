import { NoteDTO, UserDTO } from '../../../../../src/domain/dto';
import { HttpRequest } from '../../../../../src/app/contracts/http';
import { DeleteNoteHttpController } from '../../../../../src/app/controllers/rest';
import {
  MissingBodyParamsError,
  MissingHeaderParamsError,
  UserDoesNotExistsError,
  UnfinishedNoteError,
} from '../../../../../src/app/errors';
import {
  badRequest,
  noContent,
  unauthorized,
  unknown,
} from '../../../../../src/app/controllers/utils';

import { NoteServiceDummy } from '../../../../doubles/dummies/app/services/note';
import { UserServiceDummy } from '../../../../doubles/dummies/app/services/user';

import { NoteServiceStub } from '../../../../doubles/stubs/app/services/note';
import { UserServiceStub } from '../../../../doubles/stubs/app/services/user';

describe('Delete Note - HTTP Controller', () => {
  it('should throw "MissingHeaderParamsError" if userId is "undefined"', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new DeleteNoteHttpController(noteService, userService);

    const request: HttpRequest = {
      headers: {},
      body: { id: noteID },
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
    const controller = new DeleteNoteHttpController(noteService, userService);

    const request: HttpRequest = {
      headers: {
        userId: null,
      },
      body: { id: noteID },
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
    const controller = new DeleteNoteHttpController(noteService, userService);

    const request: HttpRequest = {
      headers: {
        userId: '',
      },
      body: { id: noteID },
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
    const controller = new DeleteNoteHttpController(noteService, userService);

    const request: HttpRequest = {
      headers: {
        userId: userID,
      },
      body: {},
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
    const controller = new DeleteNoteHttpController(noteService, userService);

    const request: HttpRequest = {
      headers: {
        userId: userID,
      },
      body: {
        id: null,
      },
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
    const controller = new DeleteNoteHttpController(noteService, userService);

    const request: HttpRequest = {
      headers: {
        userId: userID,
      },
      body: {
        id: '',
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['id'])),
    );
  });

  it('should throw "UserDoesNotExistsError" if id do not exists', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(null)],
    });
    const noteService = new NoteServiceDummy();
    const controller = new DeleteNoteHttpController(noteService, userService);

    const request: HttpRequest = {
      headers: {
        userId: userID,
      },
      body: { id: noteID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(unauthorized(new UserDoesNotExistsError()));
  });

  it('should throw "UnfinishedNoteError" if note is not finished', async () => {
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
      deleteNote: [Promise.resolve(note.finished)],
    });
    const controller = new DeleteNoteHttpController(noteService, userService);

    const request: HttpRequest = {
      headers: {
        userId: userID,
      },
      body: { id: noteID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new UnfinishedNoteError(note.id)),
    );
  });

  it('should return "unknown" status by unpredicted response', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.reject(new Error('unknown'))],
    });
    const noteService = new NoteServiceDummy();
    const controller = new DeleteNoteHttpController(noteService, userService);

    const request: HttpRequest = {
      headers: {
        userId: userID,
      },
      body: { id: noteID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(unknown(new Error('unknown')));
  });

  it('should delete note', async () => {
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
      finished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(user)],
    });
    const noteService = new NoteServiceStub({
      deleteNote: [Promise.resolve(note.finished)],
    });
    const controller = new DeleteNoteHttpController(noteService, userService);

    const request: HttpRequest = {
      headers: {
        userId: userID,
      },
      body: { id: noteID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(noContent());
  });
});
