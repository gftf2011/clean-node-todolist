import { UserDTO } from '../../../../src/domain/dto';

import { AuthMiddleware } from '../../../../src/app/middlewares';
import { HttpRequest } from '../../../../src/app/contracts/http';
import {
  badRequest,
  forbidden,
  ok,
  unauthorized,
} from '../../../../src/app/middlewares/utils';
import {
  InvalidTokenSubjectError,
  MissingHeaderParamsError,
  UserDoesNotExistsError,
} from '../../../../src/app/errors';

import { UserServiceDummy } from '../../../doubles/dummies/app/services/user';
import { DecryptionProviderDummy } from '../../../doubles/dummies/infra/providers/decryption';

import { UserServiceStub } from '../../../doubles/stubs/app/services/user';
import { DecryptionProviderStub } from '../../../doubles/stubs/infra/providers/decryption';

describe('Auth - Middleware', () => {
  it('should throw "MissingHeaderParamsError" if authorization is "undefined"', async () => {
    const provider = new DecryptionProviderDummy();
    const service = new UserServiceDummy();
    const middleware = new AuthMiddleware(service, provider);

    const request: HttpRequest = {
      headers: {},
    };

    const response = await middleware.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['authorization'])),
    );
  });

  it('should throw "MissingHeaderParamsError" if authorization is "null"', async () => {
    const provider = new DecryptionProviderDummy();
    const service = new UserServiceDummy();
    const middleware = new AuthMiddleware(service, provider);

    const request: HttpRequest = {
      headers: {
        authorization: null,
      },
    };

    const response = await middleware.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['authorization'])),
    );
  });

  it('should throw "MissingHeaderParamsError" if authorization is empty string', async () => {
    const provider = new DecryptionProviderDummy();
    const service = new UserServiceDummy();
    const middleware = new AuthMiddleware(service, provider);

    const request: HttpRequest = {
      headers: {
        authorization: '',
      },
    };

    const response = await middleware.handle(request);

    expect(response).toStrictEqual(
      badRequest(new MissingHeaderParamsError(['authorization'])),
    );
  });

  it('should throw "UserDoesNotExistsError" if user do not exists', async () => {
    const provider = new DecryptionProviderDummy();
    const service = new UserServiceStub({
      getUser: [Promise.resolve(null)],
      validateToken: [Promise.resolve({ id: 'id_mock', sub: 'subject_mock' })],
    });
    const middleware = new AuthMiddleware(service, provider);

    const request: HttpRequest = {
      headers: {
        authorization: 'Bearer token',
      },
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

    const provider = new DecryptionProviderStub({
      decriptedArray: ['wrong_subject_mock'],
    });
    const service = new UserServiceStub({
      getUser: [Promise.resolve(user)],
      validateToken: [Promise.resolve({ id: userID, sub: 'subject_mock' })],
    });
    const middleware = new AuthMiddleware(service, provider);

    const request: HttpRequest = {
      headers: {
        authorization: 'Bearer token',
      },
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

    const provider = new DecryptionProviderStub({
      decriptedArray: ['email_mock'],
    });
    const service = new UserServiceStub({
      getUser: [Promise.resolve(user)],
      validateToken: [Promise.resolve({ id: userID, sub: 'subject_mock' })],
    });
    const middleware = new AuthMiddleware(service, provider);

    const request: HttpRequest = {
      headers: {
        authorization: 'Bearer token',
      },
    };

    const response = await middleware.handle(request);

    expect(response).toStrictEqual(ok({ userId: userID }));
  });
});
