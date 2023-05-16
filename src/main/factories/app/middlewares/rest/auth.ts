import { AuthHttpMiddleware } from '../../../../../app/middlewares/rest';
import { Middleware } from '../../../../../app/contracts/middlewares';
import { UserServiceImpl } from '../../../../../app/services';
import { TransactionMiddlewareDecorator } from '../../../../../app/middlewares/decorators';

import { makeBus } from '../../../infra/bus';
import { PostgresTransaction } from '../../../../../infra/database/postgres';

export const makeAuthHttpMiddleware = (): Middleware => {
  const postgres = new PostgresTransaction();
  const bus = makeBus(postgres);
  const userService = new UserServiceImpl(bus);
  const middleware = new AuthHttpMiddleware(userService);

  const transaction = new TransactionMiddlewareDecorator(middleware, postgres);

  return transaction;
};
