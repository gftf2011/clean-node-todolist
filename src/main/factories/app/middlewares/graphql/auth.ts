import { AuthGraphqlMiddleware } from '../../../../../app/middlewares/graphql';
import { Middleware } from '../../../../../app/contracts/middlewares';
import { UserServiceImpl } from '../../../../../app/services';
import { TransactionMiddlewareDecorator } from '../../../../../app/middlewares/decorators';

import { makeBus } from '../../../infra/bus';
import { PostgresTransaction } from '../../../../../infra/database/postgres';

export const makeAuthGraphqlMiddleware = (): Middleware => {
  const postgres = new PostgresTransaction();
  const bus = makeBus(postgres);
  const userService = new UserServiceImpl(bus);
  const middleware = new AuthGraphqlMiddleware(userService);

  const transaction = new TransactionMiddlewareDecorator(middleware, postgres);

  return transaction;
};
