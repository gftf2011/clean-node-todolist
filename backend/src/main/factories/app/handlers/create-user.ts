import { CreateUserHandler } from '../../../../app/handlers';
import {
  SequencingProviderImpl,
  Aes256CBCEncryptionProviderCreator,
  HashSha512ProviderCreator,
} from '../../../../infra/providers';
import { LocalUserRepositoryFactory } from '../../../../infra/repositories';

export const makeCreateUserHandler = (): CreateUserHandler => {
  const aes256EncryptionProvider = new Aes256CBCEncryptionProviderCreator(
    process.env.ENCRYPTION_KEY,
    process.env.ENCRYPTION_IV,
  );
  const hashSha512Provider = new HashSha512ProviderCreator();
  const sequencingProvider = new SequencingProviderImpl();
  const userRepository = new LocalUserRepositoryFactory().createRepository();

  const handler = new CreateUserHandler(
    sequencingProvider,
    aes256EncryptionProvider,
    hashSha512Provider,
    userRepository,
  );

  return handler;
};
