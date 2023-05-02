import { UserDTO } from '../../../../src/domain/dto';

import { HttpRequest } from '../../../../src/app/contracts/http';
import { SignInController } from '../../../../src/app/controllers';
import {
  MissingBodyParamsError,
  PasswordDoesNotMatchError,
  UserDoesNotExistsError,
} from '../../../../src/app/errors';
import {
  badRequest,
  forbidden,
  unauthorized,
  unknown,
  ok,
} from '../../../../src/app/controllers/utils';

import { UserServiceDummy } from '../../../doubles/dummies/app/services/user';

import { UserServiceStub } from '../../../doubles/stubs/app/services/user';

describe('Sign In - Controller', () => {
  it('should throw "MissingBodyParamsError" if email is "undefined"', async () => {
    const user: Omit<{ email: string; password: string }, 'email'> = {
      password: 'password_mock',
    };

    const service = new UserServiceDummy();

    const request: HttpRequest<{ email: string; password: string }> = {
      body: user as { email: string; password: string },
    };

    const controller = new SignInController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['email'])),
    );
  });

  it('should throw "MissingBodyParamsError" if email is "null"', async () => {
    const user: { email: string; password: string } = {
      email: null,
      password: 'password_mock',
    };

    const service = new UserServiceDummy();

    const request: HttpRequest<{ email: string; password: string }> = {
      body: user as { email: string; password: string },
    };

    const controller = new SignInController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['email'])),
    );
  });

  it('should throw "MissingBodyParamsError" if email is empty string', async () => {
    const user: { email: string; password: string } = {
      email: '',
      password: 'password_mock',
    };

    const service = new UserServiceDummy();

    const request: HttpRequest<{ email: string; password: string }> = {
      body: user as { email: string; password: string },
    };

    const controller = new SignInController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['email'])),
    );
  });

  it('should throw "MissingBodyParamsError" if password is "undefined"', async () => {
    const user: Omit<{ email: string; password: string }, 'password'> = {
      email: 'email_mock',
    };

    const service = new UserServiceDummy();

    const request: HttpRequest<{ email: string; password: string }> = {
      body: user as { email: string; password: string },
    };

    const controller = new SignInController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['password'])),
    );
  });

  it('should throw "MissingBodyParamsError" if password is "null"', async () => {
    const user: { email: string; password: string } = {
      email: 'email_mock',
      password: null,
    };

    const service = new UserServiceDummy();

    const request: HttpRequest<{ email: string; password: string }> = {
      body: user as { email: string; password: string },
    };

    const controller = new SignInController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['password'])),
    );
  });

  it('should throw "MissingBodyParamsError" if password is empty string', async () => {
    const user: { email: string; password: string } = {
      email: 'email_mock',
      password: '',
    };

    const service = new UserServiceDummy();

    const request: HttpRequest<{ email: string; password: string }> = {
      body: user as { email: string; password: string },
    };

    const controller = new SignInController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['password'])),
    );
  });

  it('should throw "UserDoesNotExistsError" if user do not exists in database', async () => {
    const userRequest: { email: string; password: string } = {
      email: 'email_mock',
      password: 'password_mock',
    };

    const service = new UserServiceStub({
      getUserByEmail: [Promise.resolve(null)],
    });

    const request: HttpRequest<{ email: string; password: string }> = {
      body: userRequest,
    };

    const controller = new SignInController(service);

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

    const request: HttpRequest<{ email: string; password: string }> = {
      body: userRequest,
    };

    const controller = new SignInController(service);

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

    const request: HttpRequest<{ email: string; password: string }> = {
      body: userRequest,
    };

    const controller = new SignInController(service);

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

    const request: HttpRequest<{ email: string; password: string }> = {
      body: userRequest,
    };

    const controller = new SignInController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(ok({ accessToken: 'access-token' }));
  });
});
