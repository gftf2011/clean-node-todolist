import { FindUserHandler } from '../../../../app/handlers';
import { PostgresTransaction } from '../../../../infra/database/postgres';
import {
  DecryptionFactory,
  DECRYPTION_FACTORIES,
} from '../../../../infra/providers';
import {
  RepositoriesConcreteFactory,
  REPOSITORIES_FACTORIES,
} from '../../../../infra/repositories';
import { DatabaseCircuitBreakerProxy } from '../../../../infra/database/postgres/proxies';

export const makeFindUserHandler = (): FindUserHandler => {
  const postgres = new DatabaseCircuitBreakerProxy(new PostgresTransaction());
  const repositoryFactory = new RepositoriesConcreteFactory(postgres).make(
    REPOSITORIES_FACTORIES.REMOTE,
  );
  const userRepository = repositoryFactory.createUserRepository();
  const decryption = new DecryptionFactory(
    process.env.ENCRYPTION_KEY,
    process.env.ENCRYPTION_IV,
  ).make(DECRYPTION_FACTORIES.AES_256_CBC);
  const handler = new FindUserHandler(decryption, userRepository);
  return handler;
};
