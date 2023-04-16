import { FindUserByEmailHandler } from '../../../../app/handlers';
import { PostgresTransaction } from '../../../../infra/database/postgres';
import {
  DecryptionFactory,
  EncryptionFactory,
  ENCRYPTION_FACTORIES,
  DECRYPTION_FACTORIES,
} from '../../../../infra/providers';
import {
  RepositoriesConcreteFactory,
  REPOSITORIES_FACTORIES,
} from '../../../../infra/repositories';
import { DatabaseCircuitBreakerProxy } from '../../../../infra/database/postgres/proxies';

export const makeFindUserByEmailHandler = (): FindUserByEmailHandler => {
  const postgres = new DatabaseCircuitBreakerProxy(new PostgresTransaction());
  const repositoryFactory = new RepositoriesConcreteFactory(postgres).make(
    REPOSITORIES_FACTORIES.REMOTE,
  );
  const userRepository = repositoryFactory.createUserRepository();
  const encryption = new EncryptionFactory(
    process.env.ENCRYPTION_KEY,
    process.env.ENCRYPTION_IV,
  ).make(ENCRYPTION_FACTORIES.AES_256_CBC);
  const decryption = new DecryptionFactory(
    process.env.ENCRYPTION_KEY,
    process.env.ENCRYPTION_IV,
  ).make(DECRYPTION_FACTORIES.AES_256_CBC);
  const handler = new FindUserByEmailHandler(
    encryption,
    decryption,
    userRepository,
  );
  return handler;
};
