import { UserRepository } from '../../../../src/domain/repositories';

import { FindUserByEmailHandler } from '../../../../src/app/handlers';
import { FindUserByEmailAction } from '../../../../src/app/actions';

import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../src/infra/repositories';

import { EncryptionProviderDummy } from '../../../doubles/dummies/infra/providers/encryption';
import { DecryptionProviderDummy } from '../../../doubles/dummies/infra/providers/decryption';
import { UserRepositoryDummy } from '../../../doubles/dummies/infra/repositories/user';

import { EncryptionProviderStub } from '../../../doubles/stubs/infra/providers/encryption';
import { DecryptionProviderStub } from '../../../doubles/stubs/infra/providers/decryption';

describe('Find User By Email - Handler', () => {
  let userRepository: UserRepository;

  beforeAll(() => {
    const factory = new RepositoriesConcreteFactory({} as any).make(
      REPOSITORIES_FACTORIES.LOCAL,
    );
    userRepository = factory.createUserRepository();
  });

  it('should return handler operation', () => {
    const encryptionProvider = new EncryptionProviderDummy();
    const decryptionProvider = new DecryptionProviderDummy();
    const userRepositoryDummy = new UserRepositoryDummy();

    const handler = new FindUserByEmailHandler(
      encryptionProvider,
      decryptionProvider,
      userRepositoryDummy,
    );

    expect(handler.operation).toBe('find-user-by-email');
  });

  it('should return "null" if no user is found', async () => {
    const encryptionProvider = new EncryptionProviderStub({
      encriptedArray: ['encrypted_test@mail.com'],
    });
    const decryptionProvider = new DecryptionProviderDummy();

    const handler = new FindUserByEmailHandler(
      encryptionProvider,
      decryptionProvider,
      userRepository,
    );

    const action = new FindUserByEmailAction({
      email: 'test@mail.com',
    });

    const response = await handler.handle(action);

    expect(response).toBeNull();
  });

  it('should return user by email', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    await userRepository.save({
      email: 'encrypted_test@mail.com',
      id: userID,
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
    });

    const encryptionProvider = new EncryptionProviderStub({
      encriptedArray: ['encrypted_test@mail.com'],
    });
    const decryptionProvider = new DecryptionProviderStub({
      decriptedArray: ['test@mail.com'],
    });

    const handler = new FindUserByEmailHandler(
      encryptionProvider,
      decryptionProvider,
      userRepository,
    );

    const action = new FindUserByEmailAction({
      email: 'test@mail.com',
    });

    const response = await handler.handle(action);

    expect(response).toStrictEqual({
      email: 'test@mail.com',
      id: userID,
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
    });
  });

  afterEach(async () => {
    const users = await userRepository.findAll(1, 10);
    // eslint-disable-next-line no-restricted-syntax
    for (const user of users) {
      await userRepository.delete(user.id);
    }
  });
});
