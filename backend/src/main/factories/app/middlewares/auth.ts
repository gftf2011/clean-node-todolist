import { AuthMiddleware } from '../../../../app/middlewares';
import { Middleware } from '../../../../app/contracts/middlewares';
import { UserServiceImpl } from '../../../../app/services';
import { TransactionMiddlewareDecorator } from '../../../../app/middlewares/decorators';

import {
  DecryptionFactory,
  DECRYPTION_FACTORIES,
} from '../../../../infra/providers';

import { makeBus } from '../../infra/bus';
import { PostgresTransaction } from '../../../../infra/database/postgres';

export const makeAuthMiddleware = (): Middleware => {
  const postgres = new PostgresTransaction();
  const bus = makeBus();
  const userService = new UserServiceImpl(bus);
  const decryptionProvider = new DecryptionFactory(
    process.env.ENCRYPTION_KEY_AES_256_CBC,
    process.env.ENCRYPTION_IV_AES_256_CBC,
  ).make(DECRYPTION_FACTORIES.AES_256_CBC);
  const middleware = new AuthMiddleware(userService, decryptionProvider);

  const transaction = new TransactionMiddlewareDecorator(middleware, postgres);

  return transaction;
};
