import { Controller } from '../../../../app/contracts/controllers';
import { SignInController } from '../../../../app/controllers';
import { UserServiceImpl } from '../../../../app/services';
import { makeBus } from '../../infra/bus';
import { TransactionControllerDecorator } from '../../../../app/controllers/decorators';
import { PostgresTransaction } from '../../../../infra/database/postgres';

export const makeSignInController = (): Controller => {
  const postgres = new PostgresTransaction();
  const bus = makeBus(postgres);
  const userService = new UserServiceImpl(bus);
  const controller = new SignInController(userService);

  const transaction = new TransactionControllerDecorator(controller, postgres);

  return transaction;
};
