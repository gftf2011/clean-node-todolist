import { UserDTO } from '../../../../../src/domain/dto';
import { GraphqlRequest } from '../../../../../src/app/contracts/graphql';
import { UpdateFinishedNoteGraphqlController } from '../../../../../src/app/controllers/graphql';
import { UserDoesNotExistsError } from '../../../../../src/app/errors';
import {
  noContent,
  unknown,
  unauthorized,
} from '../../../../../src/app/controllers/utils';

import { NoteServiceDummy } from '../../../../doubles/dummies/app/services/note';

import { NoteServiceStub } from '../../../../doubles/stubs/app/services/note';
import { UserServiceStub } from '../../../../doubles/stubs/app/services/user';

describe('Update Finished Note - Graphql Controller', () => {
  it('should throw "UserDoesNotExistsError" user do not exists in database', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const userService = new UserServiceStub({
      getUser: [Promise.resolve(null)],
    });
    const noteService = new NoteServiceDummy();
    const controller = new UpdateFinishedNoteGraphqlController(
      noteService,
      userService,
    );

    const request: GraphqlRequest = {
      context: {
        req: {
          headers: {
            userId: userID,
          },
        },
      },
      args: {
        input: { id: noteID, finished: true },
      },
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
    const controller = new UpdateFinishedNoteGraphqlController(
      noteService,
      userService,
    );

    const request: GraphqlRequest = {
      context: {
        req: {
          headers: {
            userId: userID,
          },
        },
      },
      args: {
        input: { id: noteID, finished: true },
      },
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
    const controller = new UpdateFinishedNoteGraphqlController(
      noteService,
      userService,
    );

    const request: GraphqlRequest = {
      context: {
        req: {
          headers: {
            userId: userID,
          },
        },
      },
      args: {
        input: { id: noteID, finished: true },
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(noContent());
  });
});
