import { UserDTO } from '../../../../src/domain/dto';

import { HttpRequest } from '../../../../src/app/contracts/http';
import { SignUpController } from '../../../../src/app/controllers';
import {
  MissingBodyParamsError,
  UserAlreadyExistsError,
} from '../../../../src/app/errors';
import {
  badRequest,
  created,
  forbidden,
  unknown,
} from '../../../../src/app/controllers/utils';

import { UserServiceDummy } from '../../../doubles/dummies/app/services/user';

import { UserServiceStub } from '../../../doubles/stubs/app/services/user';

describe('Sign Up - Controller', () => {
  it('should throw "MissingBodyParamsError" if email do not exists', async () => {
    const user: Omit<UserDTO, 'email'> = {
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
    };

    const service = new UserServiceDummy();

    const request: HttpRequest<UserDTO> = {
      body: user as UserDTO,
    };

    const controller = new SignUpController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['email'])),
    );
  });

  it('should throw "MissingBodyParamsError" if lastname do not exists', async () => {
    const user: Omit<UserDTO, 'lastname'> = {
      email: 'email_mock',
      name: 'name_mock',
      password: 'password_mock',
    };

    const service = new UserServiceDummy();

    const request: HttpRequest<UserDTO> = {
      body: user as UserDTO,
    };

    const controller = new SignUpController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['lastname'])),
    );
  });

  it('should throw "MissingBodyParamsError" if name do not exists', async () => {
    const user: Omit<UserDTO, 'name'> = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      password: 'password_mock',
    };

    const service = new UserServiceDummy();

    const request: HttpRequest<UserDTO> = {
      body: user as UserDTO,
    };

    const controller = new SignUpController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['name'])),
    );
  });

  it('should throw "MissingBodyParamsError" if password do not exists', async () => {
    const user: Omit<UserDTO, 'password'> = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
    };

    const service = new UserServiceDummy();

    const request: HttpRequest<UserDTO> = {
      body: user as UserDTO,
    };

    const controller = new SignUpController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingBodyParamsError(['password'])),
    );
  });

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

    const request: HttpRequest<UserDTO> = {
      body: user as UserDTO,
    };

    const controller = new SignUpController(service);

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

    const request: HttpRequest<UserDTO> = {
      body: user as UserDTO,
    };

    const controller = new SignUpController(service);

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

    const request: HttpRequest<UserDTO> = {
      body: user as UserDTO,
    };

    const controller = new SignUpController(service);

    const response = await controller.handle(request);

    expect(response).toStrictEqual(created('access_token'));
  });
});
