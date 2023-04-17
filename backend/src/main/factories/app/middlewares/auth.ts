import { AuthMiddleware } from '../../../../app/middlewares';
import { Middleware } from '../../../../app/contracts/middlewares';
import {
  DecryptionFactory,
  DECRYPTION_FACTORIES,
  TokenProviderImpl,
} from '../../../../infra/providers';
import { PostgresTransaction } from '../../../../infra/database/postgres';
import { DatabaseCircuitBreakerProxy } from '../../../../infra/database/postgres/proxies';
import {
  RepositoriesConcreteFactory,
  REPOSITORIES_FACTORIES,
} from '../../../../infra/repositories';
import { TransactionMiddlewareDecorator } from '../../../../app/middlewares/decorators';

export const makeAuthMiddleware = (): Middleware => {
  const postgres = new PostgresTransaction();
  const proxy = new DatabaseCircuitBreakerProxy(postgres);
  const tokenProvider = new TokenProviderImpl(
    Number(process.env.JWT_EXPIRATION_TIME),
  );
  const decryptionProvider = new DecryptionFactory(
    process.env.ENCRYPTION_KEY,
    process.env.ENCRYPTION_IV,
  ).make(DECRYPTION_FACTORIES.AES_256_CBC);
  const repositoryFactory = new RepositoriesConcreteFactory(proxy).make(
    REPOSITORIES_FACTORIES.REMOTE,
  );
  const userRepository = repositoryFactory.createUserRepository();
  const middleware = new AuthMiddleware(
    tokenProvider,
    decryptionProvider,
    userRepository,
    process.env.JWT_SECRET,
  );

  const transaction = new TransactionMiddlewareDecorator(middleware, postgres);

  return transaction;
};
