import { Controller } from '../../../../../app/contracts/controllers';
import { SignInHttpController } from '../../../../../app/controllers/rest';
import { UserServiceImpl } from '../../../../../app/services';
import { makeBus } from '../../../infra/bus';
import { TransactionControllerDecorator } from '../../../../../app/controllers/decorators';
import { PostgresTransaction } from '../../../../../infra/database/postgres';

export const makeSignInHttpController = (): Controller => {
  const postgres = new PostgresTransaction();
  const bus = makeBus(postgres);
  const userService = new UserServiceImpl(bus);
  const controller = new SignInHttpController(userService);

  const transaction = new TransactionControllerDecorator(controller, postgres);

  return transaction;
};
