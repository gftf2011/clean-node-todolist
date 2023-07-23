import { NoteDTO, UserDTO } from '../../../../../src/domain/dto';
import { NotesViewModel } from '../../../../../src/app/controllers/view-models';
import { GraphqlRequest } from '../../../../../src/app/contracts/graphql';
import { GetNotesByUserIdGraphqlController } from '../../../../../src/app/controllers/graphql';
import { UserDoesNotExistsError } from '../../../../../src/app/errors';
import {
  ok,
  unauthorized,
  unknown,
} from '../../../../../src/app/controllers/utils';

import { NoteServiceDummy } from '../../../../doubles/dummies/app/services/note';

import { NoteServiceStub } from '../../../../doubles/stubs/app/services/note';
import { UserServiceStub } from '../../../../doubles/stubs/app/services/user';

describe('Get Notes By User Id - Graphql Controller', () => {
  it('should throw "UserDoesNotExistsError" user do not exists in database', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(null)],
    });
    const noteService = new NoteServiceDummy();
    const controller = new GetNotesByUserIdGraphqlController(
      noteService,
      userService,
    );

    const request: GraphqlRequest = {
      args: {
        input: {
          limit: 0,
          page: 0,
        },
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

  it('should return "unknown" status by unpredicted response', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.reject(new Error('unknown'))],
    });
    const noteService = new NoteServiceDummy();
    const controller = new GetNotesByUserIdGraphqlController(
      noteService,
      userService,
    );

    const request: GraphqlRequest = {
      args: {
        input: {
          limit: 0,
          page: 0,
        },
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
      getNotesByUserId: [Promise.resolve(notes), Promise.resolve([])],
    });
    const controller = new GetNotesByUserIdGraphqlController(
      noteService,
      userService,
    );

    const request: GraphqlRequest = {
      args: {
        input: {
          limit: 0,
          page: 0,
        },
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

    expect(response).toStrictEqual(ok(NotesViewModel.map(notes, false, false)));
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
      getNotesByUserId: [Promise.resolve(notes), Promise.resolve([])],
    });
    const controller = new GetNotesByUserIdGraphqlController(
      noteService,
      userService,
    );

    const request: GraphqlRequest = {
      args: {
        input: {
          limit: 0,
          page: 0,
        },
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

    expect(response).toStrictEqual(ok(NotesViewModel.map(notes, false, false)));
  });
});
