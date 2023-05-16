import {
  InvalidEmailError,
  InvalidLastnameError,
  InvalidNameError,
  WeakPasswordError,
} from '../../../../src/domain/errors';
import { UserRepository } from '../../../../src/domain/repositories';

import { CreateUserHandler } from '../../../../src/app/handlers';
import { CreateUserAction } from '../../../../src/app/actions';

import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../src/infra/repositories';

import { SequencingProviderDummy } from '../../../doubles/dummies/infra/providers/sequencing';
import { HashProviderDummy } from '../../../doubles/dummies/infra/providers/hash';
import { EncryptionProviderDummy } from '../../../doubles/dummies/infra/providers/encryption';
import { UserRepositoryDummy } from '../../../doubles/dummies/infra/repositories/user';

import { SequencingProviderStub } from '../../../doubles/stubs/infra/providers/sequencing';
import { EncryptionProviderStub } from '../../../doubles/stubs/infra/providers/encryption';
import { HashProviderStub } from '../../../doubles/stubs/infra/providers/hash';

describe('Create User - Handler', () => {
  let userRepository: UserRepository;

  beforeAll(() => {
    const factory = new RepositoriesConcreteFactory({} as any).make(
      REPOSITORIES_FACTORIES.LOCAL,
    );
    userRepository = factory.createUserRepository();
  });

  it('should return handler operation', () => {
    const sequencingProvider = new SequencingProviderDummy();
    const encryptionProvider = new EncryptionProviderDummy();
    const hashProvider = new HashProviderDummy();
    const userRepositoryDummy = new UserRepositoryDummy();

    const handler = new CreateUserHandler(
      sequencingProvider,
      encryptionProvider,
      hashProvider,
      userRepositoryDummy,
    );

    expect(handler.operation).toBe('create-user');
  });

  it('should throw "InvalidEmailError" if email is invalid', async () => {
    const sequencingProvider = new SequencingProviderStub({
      idArray: [`${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`],
    });
    const encryptionProvider = new EncryptionProviderDummy();
    const hashProvider = new HashProviderDummy();
    const userRepositoryDummy = new UserRepositoryDummy();

    const handler = new CreateUserHandler(
      sequencingProvider,
      encryptionProvider,
      hashProvider,
      userRepositoryDummy,
    );

    const action = new CreateUserAction({
      email: '',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
    });

    const promise = handler.handle(action);

    await expect(promise).rejects.toStrictEqual(new InvalidEmailError(''));
  });

  it('should throw "InvalidNameError" if name is invalid', async () => {
    const sequencingProvider = new SequencingProviderStub({
      idArray: [`${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`],
    });
    const encryptionProvider = new EncryptionProviderDummy();
    const hashProvider = new HashProviderDummy();
    const userRepositoryDummy = new UserRepositoryDummy();

    const handler = new CreateUserHandler(
      sequencingProvider,
      encryptionProvider,
      hashProvider,
      userRepositoryDummy,
    );

    const action = new CreateUserAction({
      email: 'test@mail.com',
      lastname: 'lastname_mock',
      name: '',
      password: 'password_mock',
    });

    const promise = handler.handle(action);

    await expect(promise).rejects.toStrictEqual(new InvalidNameError(''));
  });

  it('should throw "InvalidLastnameError" if lastname is invalid', async () => {
    const sequencingProvider = new SequencingProviderStub({
      idArray: [`${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`],
    });
    const encryptionProvider = new EncryptionProviderDummy();
    const hashProvider = new HashProviderDummy();
    const userRepositoryDummy = new UserRepositoryDummy();

    const handler = new CreateUserHandler(
      sequencingProvider,
      encryptionProvider,
      hashProvider,
      userRepositoryDummy,
    );

    const action = new CreateUserAction({
      email: 'test@mail.com',
      lastname: '',
      name: 'name_mock',
      password: 'password_mock',
    });

    const promise = handler.handle(action);

    await expect(promise).rejects.toStrictEqual(new InvalidLastnameError(''));
  });

  it('should throw "WeakPasswordError" if password is invalid', async () => {
    const sequencingProvider = new SequencingProviderStub({
      idArray: [`${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`],
    });
    const encryptionProvider = new EncryptionProviderDummy();
    const hashProvider = new HashProviderDummy();
    const userRepositoryDummy = new UserRepositoryDummy();

    const handler = new CreateUserHandler(
      sequencingProvider,
      encryptionProvider,
      hashProvider,
      userRepositoryDummy,
    );

    const action = new CreateUserAction({
      email: 'test@mail.com',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: '',
    });

    const promise = handler.handle(action);

    await expect(promise).rejects.toStrictEqual(new WeakPasswordError());
  });

  it('should create user', async () => {
    const sequencingProvider = new SequencingProviderStub({
      idArray: [`${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`],
    });
    const encryptionProvider = new EncryptionProviderStub({
      encriptedArray: ['email_encrypted'],
    });
    const hashProvider = new HashProviderStub({
      encodingArray: [Promise.resolve('encoded_password')],
    });

    const handler = new CreateUserHandler(
      sequencingProvider,
      encryptionProvider,
      hashProvider,
      userRepository,
    );

    const action = new CreateUserAction({
      email: 'test@mail.com',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: '12345678aB?',
    });

    const promise = handler.handle(action);

    await expect(promise).resolves.toBeUndefined();
  });

  afterEach(async () => {
    const users = await userRepository.findAll(1, 10);
    // eslint-disable-next-line no-restricted-syntax
    for (const user of users) {
      await userRepository.delete(user.id);
    }
  });
});
