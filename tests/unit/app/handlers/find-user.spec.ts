import { UserRepository } from '../../../../src/domain/repositories';

import { FindUserHandler } from '../../../../src/app/handlers';
import { FindUserAction } from '../../../../src/app/actions';

import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../src/infra/repositories';

import { DecryptionProviderDummy } from '../../../doubles/dummies/infra/providers/decryption';
import { UserRepositoryDummy } from '../../../doubles/dummies/infra/repositories/user';

import { DecryptionProviderStub } from '../../../doubles/stubs/infra/providers/decryption';

describe('Find User - Handler', () => {
  let userRepository: UserRepository;

  beforeAll(() => {
    const factory = new RepositoriesConcreteFactory({} as any).make(
      REPOSITORIES_FACTORIES.LOCAL,
    );
    userRepository = factory.createUserRepository();
  });

  it('should return handler operation', () => {
    const decryptionProvider = new DecryptionProviderDummy();
    const userRepositoryDummy = new UserRepositoryDummy();

    const handler = new FindUserHandler(
      decryptionProvider,
      userRepositoryDummy,
    );

    expect(handler.operation).toBe('find-user');
  });

  it('should return "null" if no user is found', async () => {
    const decryptionProvider = new DecryptionProviderDummy();

    const handler = new FindUserHandler(decryptionProvider, userRepository);

    const action = new FindUserAction({
      id: 'id_mock',
    });

    const response = await handler.handle(action);

    expect(response).toBeNull();
  });

  it('should return user by id', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    await userRepository.save({
      email: 'encrypted_test@mail.com',
      id: userID,
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
    });

    const decryptionProvider = new DecryptionProviderStub({
      decriptedArray: ['test@mail.com'],
    });

    const handler = new FindUserHandler(decryptionProvider, userRepository);

    const action = new FindUserAction({
      id: userID,
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
