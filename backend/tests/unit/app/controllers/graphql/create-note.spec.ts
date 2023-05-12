import { NoteDTO, UserDTO } from '../../../../../src/domain/dto';
import { GraphqlRequest } from '../../../../../src/app/contracts/graphql';
import { CreateNoteGraphqlController } from '../../../../../src/app/controllers/graphql';
import { UserDoesNotExistsError } from '../../../../../src/app/errors';
import {
  created,
  unauthorized,
  unknown,
} from '../../../../../src/app/controllers/utils';

import { NoteServiceDummy } from '../../../../doubles/dummies/app/services/note';

import { NoteServiceStub } from '../../../../doubles/stubs/app/services/note';
import { UserServiceStub } from '../../../../doubles/stubs/app/services/user';

describe('Create Note - Graphql Controller', () => {
  it('should throw "UserDoesNotExistsError" if user is not found', async () => {
    const userService = new UserServiceStub({
      getUser: [Promise.resolve(null)],
    });
    const noteService = new NoteServiceDummy();
    const controller = new CreateNoteGraphqlController(
      noteService,
      userService,
    );

    const note: NoteDTO = {
      title: 'title_mock',
      description: 'description_mock',
    };

    const request: GraphqlRequest = {
      args: {
        input: note,
      },
      context: {
        req: {
          headers: {
            userId: 'user_id_mock',
          },
        },
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
    const controller = new CreateNoteGraphqlController(
      noteService,
      userService,
    );

    const note: NoteDTO = {
      title: 'title_mock',
      description: 'description_mock',
    };

    const request: GraphqlRequest = {
      args: {
        input: note,
      },
      context: {
        req: {
          headers: {
            userId: 'user_id_mock',
          },
        },
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
    const controller = new CreateNoteGraphqlController(
      noteService,
      userService,
    );

    const note: NoteDTO = {
      title: 'title_mock',
      description: 'description_mock',
    };

    const request: GraphqlRequest = {
      args: {
        input: note,
      },
      context: {
        req: {
          headers: {
            userId: 'user_id_mock',
          },
        },
      },
    };

    const response = await controller.handle(request);

    expect(response).toStrictEqual(created({ created: true }));
  });
});
