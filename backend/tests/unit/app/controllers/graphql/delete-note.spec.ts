import { NoteDTO, UserDTO } from '../../../../../src/domain/dto';
import { GraphqlRequest } from '../../../../../src/app/contracts/graphql';
import { DeleteNoteGraphqlController } from '../../../../../src/app/controllers/graphql';
import {
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

import { NoteServiceStub } from '../../../../doubles/stubs/app/services/note';
import { UserServiceStub } from '../../../../doubles/stubs/app/services/user';

describe('Delete Note - Graphql Controller', () => {
  it('should throw "UserDoesNotExistsError" if id do not exists', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(null)],
    });
    const noteService = new NoteServiceDummy();
    const controller = new DeleteNoteGraphqlController(
      noteService,
      userService,
    );

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
    const controller = new DeleteNoteGraphqlController(
      noteService,
      userService,
    );

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
    const controller = new DeleteNoteGraphqlController(
      noteService,
      userService,
    );

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
    const controller = new DeleteNoteGraphqlController(
      noteService,
      userService,
    );

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

    expect(response).toStrictEqual(noContent());
  });
});
