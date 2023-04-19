import { CreateUserHandler } from '../../../../app/handlers';
import { PostgresTransaction } from '../../../../infra/database/postgres';
import { DatabaseCircuitBreakerProxy } from '../../../../infra/database/postgres/proxies';
import {
  EncryptionFactory,
  ENCRYPTION_FACTORIES,
  HashFactory,
  HASH_FACTORIES,
  SequencingProviderImpl,
} from '../../../../infra/providers';
import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../infra/repositories';

export const makeCreateUserHandler = (): CreateUserHandler => {
  const encryption = new EncryptionFactory(
    process.env.ENCRYPTION_KEY_AES_256_CBC,
    process.env.ENCRYPTION_IV_AES_256_CBC,
  ).make(ENCRYPTION_FACTORIES.AES_256_CBC);
  const hash = new HashFactory().make(HASH_FACTORIES.SHA_521);
  const sequencingProvider = new SequencingProviderImpl();

  const postgres = new DatabaseCircuitBreakerProxy(new PostgresTransaction());
  const repositoryFactory = new RepositoriesConcreteFactory(postgres).make(
    REPOSITORIES_FACTORIES.REMOTE,
  );
  const userRepository = repositoryFactory.createUserRepository();

  const handler = new CreateUserHandler(
    sequencingProvider,
    encryption,
    hash,
    userRepository,
  );

  return handler;
};
