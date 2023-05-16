import { UserDTO } from '../../../../../src/domain/dto';

import { GraphqlRequest } from '../../../../../src/app/contracts/graphql';
import { SignInGraphqlController } from '../../../../../src/app/controllers/graphql';
import {
  PasswordDoesNotMatchError,
  UserDoesNotExistsError,
} from '../../../../../src/app/errors';
import {
  forbidden,
  unauthorized,
  unknown,
  ok,
} from '../../../../../src/app/controllers/utils';

import { UserServiceStub } from '../../../../doubles/stubs/app/services/user';

describe('Sign In - Graphql Controller', () => {
  it('should throw "UserDoesNotExistsError" if user do not exists in database', async () => {
    const userRequest: { email: string; password: string } = {
      email: 'email_mock',
      password: 'password_mock',
    };

    const service = new UserServiceStub({
      getUserByEmail: [Promise.resolve(null)],
    });

    const request: GraphqlRequest = {
      args: {
        input: userRequest,
      },
      context: {},
    };

    const controller = new SignInGraphqlController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(unauthorized(new UserDoesNotExistsError()));
  });

  it('should throw "PasswordDoesNotMatchError" if passwords do not match', async () => {
    const user: UserDTO = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
      id: 'id_mock',
    };

    const userRequest: { email: string; password: string } = {
      email: 'email_mock',
      password: 'password_mock',
    };

    const service = new UserServiceStub({
      getUserByEmail: [Promise.resolve(user)],
      matchPassword: [Promise.resolve(false)],
    });

    const request: GraphqlRequest = {
      args: {
        input: userRequest,
      },
      context: {},
    };

    const controller = new SignInGraphqlController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(forbidden(new PasswordDoesNotMatchError()));
  });

  it('should return "unknown" status by unpredicted response', async () => {
    const userRequest: { email: string; password: string } = {
      email: 'email_mock',
      password: 'password_mock',
    };

    const service = new UserServiceStub({
      getUserByEmail: [Promise.reject(new Error('unknown'))],
    });

    const request: GraphqlRequest = {
      args: {
        input: userRequest,
      },
      context: {},
    };

    const controller = new SignInGraphqlController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(unknown(new Error('unknown')));
  });

  it('should create session', async () => {
    const user: UserDTO = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
      id: 'id_mock',
    };

    const userRequest: { email: string; password: string } = {
      email: 'email_mock',
      password: 'password_mock',
    };

    const service = new UserServiceStub({
      getUserByEmail: [Promise.resolve(user)],
      matchPassword: [Promise.resolve(true)],
      createSession: [Promise.resolve('access-token')],
    });

    const request: GraphqlRequest = {
      args: {
        input: userRequest,
      },
      context: {},
    };

    const controller = new SignInGraphqlController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(ok({ accessToken: 'access-token' }));
  });
});
