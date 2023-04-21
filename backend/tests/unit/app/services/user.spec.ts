import { UserDTO } from '../../../../src/domain/dto';

import {
  CreateAccessTokenAction,
  CreateUserAction,
  FindUserAction,
  FindUserByEmailAction,
  PasswordMatchAction,
} from '../../../../src/app/actions';
import { UserServiceImpl } from '../../../../src/app/services';

import { BusMediator } from '../../../../src/infra/bus';

import {
  CreateUserHandlerSpy,
  CreateAccessTokenHandlerSpy,
  FindUserHandlerSpy,
  FindUserByEmailHandlerSpy,
  PasswordMatchHandlerSpy,
} from '../../../doubles/spies/app/handlers';

describe('User - Service', () => {
  it('should call "saveUser" method', async () => {
    const handler = new CreateUserHandlerSpy();
    const bus = new BusMediator([handler]);
    const service = new UserServiceImpl(bus);

    const user: UserDTO = {
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
    };

    await service.saveUser(user);

    const action = new CreateUserAction(user);

    expect(handler.getInfo().calls).toBe(1);
    expect(handler.getInfo().data).toStrictEqual([action]);
  });

  it('should call "createSession" method', async () => {
    const handler = new CreateAccessTokenHandlerSpy({
      tokens: ['access-token'],
    });
    const bus = new BusMediator([handler]);
    const service = new UserServiceImpl(bus);

    const id = 'id_mock';
    const email = 'email_mock';

    const response = await service.createSession(id, email);

    const action = new CreateAccessTokenAction({
      email,
      id,
    });

    expect(response).toBe('access-token');
    expect(handler.getInfo().calls).toBe(1);
    expect(handler.getInfo().data).toStrictEqual([action]);
  });

  it('should call "getUser" method', async () => {
    const user: UserDTO = {
      id: 'id_mock',
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
    };

    const handler = new FindUserHandlerSpy({
      users: [user],
    });
    const bus = new BusMediator([handler]);
    const service = new UserServiceImpl(bus);

    const id = 'id_mock';

    const response = await service.getUser(id);

    const action = new FindUserAction({ id });

    expect(response).toStrictEqual(user);
    expect(handler.getInfo().calls).toBe(1);
    expect(handler.getInfo().data).toStrictEqual([action]);
  });

  it('should call "getUserByEmail" method', async () => {
    const user: UserDTO = {
      id: 'id_mock',
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
    };

    const handler = new FindUserByEmailHandlerSpy({
      users: [user],
    });
    const bus = new BusMediator([handler]);
    const service = new UserServiceImpl(bus);

    const email = 'email_mock';

    const response = await service.getUserByEmail(email);

    const action = new FindUserByEmailAction({ email });

    expect(response).toStrictEqual(user);
    expect(handler.getInfo().calls).toBe(1);
    expect(handler.getInfo().data).toStrictEqual([action]);
  });

  it('should call "matchPassword" method', async () => {
    const handler = new PasswordMatchHandlerSpy({
      results: [true],
    });
    const bus = new BusMediator([handler]);
    const service = new UserServiceImpl(bus);

    const email = 'email_mock';
    const password = 'password_mock';
    const hashedPassword = 'hashed_password_mock';

    const response = await service.matchPassword(
      email,
      password,
      hashedPassword,
    );

    const action = new PasswordMatchAction({ email, password, hashedPassword });

    expect(response).toBe(true);
    expect(handler.getInfo().calls).toBe(1);
    expect(handler.getInfo().data).toStrictEqual([action]);
  });
});
