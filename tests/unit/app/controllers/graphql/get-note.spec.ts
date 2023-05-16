import { NoteDTO, UserDTO } from '../../../../../src/domain/dto';
import { NoteViewModel } from '../../../../../src/app/controllers/view-models';
import { GraphqlRequest } from '../../../../../src/app/contracts/graphql';
import { GetNoteGraphqlController } from '../../../../../src/app/controllers/graphql';
import {
  UserDoesNotExistsError,
  NoteNotFoundError,
} from '../../../../../src/app/errors';
import {
  badRequest,
  ok,
  unauthorized,
  unknown,
} from '../../../../../src/app/controllers/utils';

import { NoteServiceDummy } from '../../../../doubles/dummies/app/services/note';

import { NoteServiceStub } from '../../../../doubles/stubs/app/services/note';
import { UserServiceStub } from '../../../../doubles/stubs/app/services/user';

describe('Get Note - Graphql Controller', () => {
  it('should throw "UserDoesNotExistsError" user do not exists in database', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(null)],
    });
    const noteService = new NoteServiceDummy();
    const controller = new GetNoteGraphqlController(noteService, userService);

    const request: GraphqlRequest = {
      args: {
        input: { id: noteID },
      },
      context: {
        req: {
          headers: {
            userId: userID,
          },
        },
      },
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
    const controller = new GetNoteGraphqlController(noteService, userService);

    const request: GraphqlRequest = {
      args: {
        input: { id: noteID },
      },
      context: {
        req: {
          headers: {
            userId: userID,
          },
        },
      },
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
    const controller = new GetNoteGraphqlController(noteService, userService);

    const request: GraphqlRequest = {
      args: {
        input: { id: noteID },
      },
      context: {
        req: {
          headers: {
            userId: userID,
          },
        },
      },
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
    const controller = new GetNoteGraphqlController(noteService, userService);

    const request: GraphqlRequest = {
      args: {
        input: { id: noteID },
      },
      context: {
        req: {
          headers: {
            userId: userID,
          },
        },
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(ok(NoteViewModel.map(note)));
  });
});
