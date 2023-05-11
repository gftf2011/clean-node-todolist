import { NoteDTO, UserDTO } from '../../../../../src/domain/dto';
import { NotesViewModel } from '../../../../../src/app/controllers/view-models';
import { HttpRequest } from '../../../../../src/app/contracts/http';
import { GetNotesByUserIdHttpController } from '../../../../../src/app/controllers/rest';
import {
  MissingHeaderParamsError,
  UserDoesNotExistsError,
} from '../../../../../src/app/errors';
import {
  badRequest,
  ok,
  unauthorized,
  unknown,
} from '../../../../../src/app/controllers/utils';

import { NoteServiceDummy } from '../../../../doubles/dummies/app/services/note';
import { UserServiceDummy } from '../../../../doubles/dummies/app/services/user';

import { NoteServiceStub } from '../../../../doubles/stubs/app/services/note';
import { UserServiceStub } from '../../../../doubles/stubs/app/services/user';

describe('Get Notes By User Id - Controller', () => {
  it('should throw "MissingHeaderParamsError" if userId is "undefined"', async () => {
    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new GetNotesByUserIdHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: {
        limit: 0,
        page: 0,
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['userId'])),
    );
  });

  it('should throw "MissingHeaderParamsError" if userId is "null"', async () => {
    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new GetNotesByUserIdHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: {
        userId: null,
        limit: 0,
        page: 0,
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['userId'])),
    );
  });

  it('should throw "MissingHeaderParamsError" if userId is empty string', async () => {
    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new GetNotesByUserIdHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: {
        userId: '',
        limit: 0,
        page: 0,
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['userId'])),
    );
  });

  it('should throw "MissingHeaderParamsError" if limit is "undefined"', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new GetNotesByUserIdHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: {
        userId: userID,
        page: 0,
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['limit'])),
    );
  });

  it('should throw "MissingHeaderParamsError" if limit is "null"', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new GetNotesByUserIdHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: {
        userId: userID,
        limit: null,
        page: 0,
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['limit'])),
    );
  });

  it('should throw "MissingHeaderParamsError" if page is "undefined"', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new GetNotesByUserIdHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: {
        userId: userID,
        limit: 0,
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['page'])),
    );
  });

  it('should throw "MissingHeaderParamsError" if page is "null"', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new GetNotesByUserIdHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: {
        userId: userID,
        limit: 0,
        page: null,
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['page'])),
    );
  });

  it('should throw "UserDoesNotExistsError" user do not exists in database', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(null)],
    });
    const noteService = new NoteServiceDummy();
    const controller = new GetNotesByUserIdHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: {
        userId: userID,
        limit: 0,
        page: 0,
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(unauthorized(new UserDoesNotExistsError()));
  });

  it('should return "unknown" status by unpredicted response', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.reject(new Error('unknown'))],
    });
    const noteService = new NoteServiceDummy();
    const controller = new GetNotesByUserIdHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: {
        userId: userID,
        limit: 0,
        page: 0,
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(unknown(new Error('unknown')));
  });

  it('should return an empty list of notes', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const user: UserDTO = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
      id: userID,
    };

    const notes: NoteDTO[] = [];

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(user)],
    });
    const noteService = new NoteServiceStub({
      getNotesByUserId: [Promise.resolve(notes)],
    });
    const controller = new GetNotesByUserIdHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: {
        userId: userID,
        limit: 0,
        page: 0,
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(ok(NotesViewModel.map(notes)));
  });

  it('should return notes', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const user: UserDTO = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
      id: userID,
    };

    const notes: NoteDTO[] = [
      {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        title: 'title1_mock',
        description: 'description1_mock',
        finished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        title: 'title2_mock',
        description: 'description2_mock',
        finished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(user)],
    });
    const noteService = new NoteServiceStub({
      getNotesByUserId: [Promise.resolve(notes)],
    });
    const controller = new GetNotesByUserIdHttpController(
      noteService,
      userService,
    );

    const request: HttpRequest = {
      headers: {
        userId: userID,
        limit: 0,
        page: 0,
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(ok(NotesViewModel.map(notes)));
  });
});
