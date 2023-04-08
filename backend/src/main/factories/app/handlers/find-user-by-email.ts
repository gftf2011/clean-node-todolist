import { FindUserByEmailHandler } from '../../../../app/handlers';
import { Aes256CBCEncryptionProviderCreator } from '../../../../infra/providers';
import { LocalUserRepositoryFactory } from '../../../../infra/repositories';

export const makeFindUserByEmailHandler = (): FindUserByEmailHandler => {
  const aes256EncryptionProvider = new Aes256CBCEncryptionProviderCreator(
    process.env.ENCRYPTION_KEY,
    process.env.ENCRYPTION_IV,
  );
  const userRepository = new LocalUserRepositoryFactory().createRepository();

  const handler = new FindUserByEmailHandler(
    aes256EncryptionProvider,
    userRepository,
  );

  return handler;
};
