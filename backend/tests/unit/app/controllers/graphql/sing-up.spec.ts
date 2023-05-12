import { UserDTO } from '../../../../../src/domain/dto';

import { GraphqlRequest } from '../../../../../src/app/contracts/graphql';
import { SignUpGraphqlController } from '../../../../../src/app/controllers/graphql';
import { UserAlreadyExistsError } from '../../../../../src/app/errors';
import {
  created,
  forbidden,
  unknown,
} from '../../../../../src/app/controllers/utils';

import { UserServiceStub } from '../../../../doubles/stubs/app/services/user';

describe('Sign Up - Graphql Controller', () => {
  it('should throw "UserAlreadyExistsError" if user already exists in database', async () => {
    const user: UserDTO = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
    };

    const service = new UserServiceStub({
      getUserByEmail: [Promise.resolve(user)],
    });

    const request: GraphqlRequest = {
      args: {
        input: user as UserDTO,
      },
      context: {},
    };

    const controller = new SignUpGraphqlController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(forbidden(new UserAlreadyExistsError()));
  });

  it('should return "unknown" status by unpredicted response', async () => {
    const user: UserDTO = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
      id: 'id_mock',
    };

    const service = new UserServiceStub({
      getUserByEmail: [Promise.reject(new Error('unknown'))],
    });

    const request: GraphqlRequest = {
      args: {
        input: user as UserDTO,
      },
      context: {},
    };

    const controller = new SignUpGraphqlController(service);

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

    const service = new UserServiceStub({
      getUserByEmail: [Promise.resolve(null), Promise.resolve(user)],
      saveUser: [Promise.resolve()],
      createSession: [Promise.resolve('access_token')],
    });

    const request: GraphqlRequest = {
      args: {
        input: user as UserDTO,
      },
      context: {},
    };

    const controller = new SignUpGraphqlController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(created({ accessToken: 'access_token' }));
  });
});
