import { NoteDTO, UserDTO } from '../../../../../src/domain/dto';
import { HttpRequest } from '../../../../../src/app/contracts/http';
import { CreateNoteHttpController } from '../../../../../src/app/controllers/rest';
import {
  MissingBodyParamsError,
  MissingHeaderParamsError,
  UserDoesNotExistsError,
} from '../../../../../src/app/errors';
import {
  badRequest,
  created,
  unauthorized,
  unknown,
} from '../../../../../src/app/controllers/utils';

import { NoteServiceDummy } from '../../../../doubles/dummies/app/services/note';
import { UserServiceDummy } from '../../../../doubles/dummies/app/services/user';

import { NoteServiceStub } from '../../../../doubles/stubs/app/services/note';
import { UserServiceStub } from '../../../../doubles/stubs/app/services/user';

describe('Create Note - Controller', () => {
  it('should throw "MissingBodyParamsError" if title is "undefined"', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new CreateNoteHttpController(noteService, userService);

    const note: Omit<NoteDTO, 'title'> = {
      description: 'description_mock',
    };

    const request: HttpRequest<NoteDTO> = {
      body: note as NoteDTO,
      headers: { userId: userID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['title'])),
    );
  });

  it('should throw "MissingBodyParamsError" if title is "null"', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new CreateNoteHttpController(noteService, userService);

    const note: NoteDTO = {
      title: null,
      description: 'description_mock',
    };

    const request: HttpRequest<NoteDTO> = {
      body: note as NoteDTO,
      headers: { userId: userID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['title'])),
    );
  });

  it('should throw "MissingBodyParamsError" if title is empty string', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new CreateNoteHttpController(noteService, userService);

    const note: NoteDTO = {
      title: '',
      description: 'description_mock',
    };

    const request: HttpRequest<NoteDTO> = {
      body: note as NoteDTO,
      headers: { userId: userID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['title'])),
    );
  });

  it('should throw "MissingBodyParamsError" if description is "undefined"', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new CreateNoteHttpController(noteService, userService);

    const note: Omit<NoteDTO, 'description'> = {
      title: 'title_mock',
    };

    const request: HttpRequest<NoteDTO> = {
      body: note as NoteDTO,
      headers: { userId: userID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['description'])),
    );
  });

  it('should throw "MissingBodyParamsError" if description is "null"', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new CreateNoteHttpController(noteService, userService);

    const note: NoteDTO = {
      title: 'title_mock',
      description: null,
    };

    const request: HttpRequest<NoteDTO> = {
      body: note as NoteDTO,
      headers: { userId: userID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['description'])),
    );
  });

  it('should throw "MissingBodyParamsError" if description is empty string', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new CreateNoteHttpController(noteService, userService);

    const note: NoteDTO = {
      title: 'title_mock',
      description: '',
    };

    const request: HttpRequest<NoteDTO> = {
      body: note as NoteDTO,
      headers: { userId: userID },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['description'])),
    );
  });

  it('should throw "MissingHeaderParamsError" if userId is "undefined"', async () => {
    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new CreateNoteHttpController(noteService, userService);

    const note: NoteDTO = {
      title: 'title_mock',
      description: 'description_mock',
    };

    const request: HttpRequest<NoteDTO> = {
      body: note,
      headers: {},
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['userId'])),
    );
  });

  it('should throw "MissingHeaderParamsError" if userId is "null"', async () => {
    const userService = new UserServiceDummy();
    const noteService = new NoteServiceDummy();
    const controller = new CreateNoteHttpController(noteService, userService);

    const note: NoteDTO = {
      title: 'title_mock',
      description: 'description_mock',
    };

    const request: HttpRequest<NoteDTO> = {
      body: note,
      headers: {
        userId: null,
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
    const controller = new CreateNoteHttpController(noteService, userService);

    const note: NoteDTO = {
      title: 'title_mock',
      description: 'description_mock',
    };

    const request: HttpRequest<NoteDTO> = {
      body: note,
      headers: {
        userId: '',
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['userId'])),
    );
  });

  it('should throw "UserDoesNotExistsError" if user is not found', async () => {
    const userService = new UserServiceStub({
      getUser: [Promise.resolve(null)],
    });
    const noteService = new NoteServiceDummy();
    const controller = new CreateNoteHttpController(noteService, userService);

    const note: NoteDTO = {
      title: 'title_mock',
      description: 'description_mock',
    };

    const request: HttpRequest<NoteDTO> = {
      body: note,
      headers: {
        userId: 'user_id_mock',
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(unauthorized(new UserDoesNotExistsError()));
  });

  it('should return "unknown" status by unpredicted response', async () => {
    const userService = new UserServiceStub({
      getUser: [Promise.reject(new Error('unknown'))],
    });
    const noteService = new NoteServiceDummy();
    const controller = new CreateNoteHttpController(noteService, userService);

    const note: NoteDTO = {
      title: 'title_mock',
      description: 'description_mock',
    };

    const request: HttpRequest<NoteDTO> = {
      body: note,
      headers: {
        userId: 'user_id_mock',
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(unknown(new Error('unknown')));
  });

  it('should save note', async () => {
    const user: UserDTO = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
      id: 'id_mock',
    };

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(user)],
    });
    const noteService = new NoteServiceStub({
      saveNote: [Promise.resolve()],
    });
    const controller = new CreateNoteHttpController(noteService, userService);

    const note: NoteDTO = {
      title: 'title_mock',
      description: 'description_mock',
    };

    const request: HttpRequest<NoteDTO> = {
      body: note,
      headers: {
        userId: 'user_id_mock',
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(created({ created: true }));
  });
});
