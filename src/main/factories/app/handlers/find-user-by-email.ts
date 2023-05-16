import { DatabaseTransaction } from '../../../../app/contracts/database';
import { FindUserByEmailHandler } from '../../../../app/handlers';
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

export const makeFindUserByEmailHandler = (
  database?: DatabaseTransaction,
): FindUserByEmailHandler => {
  const postgres = new DatabaseCircuitBreakerProxy(database);
  const repositoryFactory = new RepositoriesConcreteFactory(postgres).make(
    REPOSITORIES_FACTORIES.REMOTE,
  );
  const userRepository = repositoryFactory.createUserRepository();
  const encryption = new EncryptionFactory(
    process.env.ENCRYPTION_KEY_AES_256_CBC,
    process.env.ENCRYPTION_IV_AES_256_CBC,
  ).make(ENCRYPTION_FACTORIES.AES_256_CBC);
  const decryption = new DecryptionFactory(
    process.env.ENCRYPTION_KEY_AES_256_CBC,
    process.env.ENCRYPTION_IV_AES_256_CBC,
  ).make(DECRYPTION_FACTORIES.AES_256_CBC);
  const handler = new FindUserByEmailHandler(
    encryption,
    decryption,
    userRepository,
  );
  return handler;
};
