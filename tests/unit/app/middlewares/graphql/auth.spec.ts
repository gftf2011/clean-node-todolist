import { UserDTO } from '../../../../../src/domain/dto';

import { AuthGraphqlMiddleware } from '../../../../../src/app/middlewares/graphql';
import { GraphqlRequest } from '../../../../../src/app/contracts/graphql';
import {
  forbidden,
  ok,
  unauthorized,
} from '../../../../../src/app/middlewares/utils';
import {
  InvalidTokenSubjectError,
  UserDoesNotExistsError,
} from '../../../../../src/app/errors';

import { UserServiceStub } from '../../../../doubles/stubs/app/services/user';

describe('Auth - Graphql Middleware', () => {
  it('should throw "UserDoesNotExistsError" if user do not exists', async () => {
    const service = new UserServiceStub({
      getUser: [Promise.resolve(null)],
      validateToken: [Promise.resolve({ id: 'id_mock', sub: 'subject_mock' })],
    });
    const middleware = new AuthGraphqlMiddleware(service);

    const request: GraphqlRequest = {
      context: {
        req: {
          headers: {
            authorization: 'Bearer token',
          },
        },
      },
      args: {},
    };

    const response = await middleware.handle(request);

    expect(response).toStrictEqual(unauthorized(new UserDoesNotExistsError()));
  });

  it('should throw "InvalidTokenSubjectError" if subject does not match', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const user: UserDTO = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
      id: userID,
    };

    const service = new UserServiceStub({
      getUser: [Promise.resolve(user)],
      validateToken: [Promise.resolve({ id: userID, sub: 'subject_mock' })],
    });
    const middleware = new AuthGraphqlMiddleware(service);

    const request: GraphqlRequest = {
      context: {
        req: {
          headers: {
            authorization: 'Bearer token',
          },
        },
      },
      args: {},
    };

    const response = await middleware.handle(request);

    expect(response).toStrictEqual(forbidden(new InvalidTokenSubjectError()));
  });

  it('should return userId', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const user: UserDTO = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
      id: userID,
    };

    const service = new UserServiceStub({
      getUser: [Promise.resolve(user)],
      validateToken: [Promise.resolve({ id: userID, sub: 'email_mock' })],
    });
    const middleware = new AuthGraphqlMiddleware(service);

    const request: GraphqlRequest = {
      context: {
        req: {
          headers: {
            authorization: 'Bearer token',
          },
        },
      },
      args: {},
    };

    const response = await middleware.handle(request);

    expect(response).toStrictEqual(ok({ userId: userID }));
  });
});
