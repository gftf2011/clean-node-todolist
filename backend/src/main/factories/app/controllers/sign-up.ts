import { Controller } from '../../../../app/contracts/controllers';
import { SignUpController } from '../../../../app/controllers';
import { UserServiceImpl } from '../../../../app/services';
import { makeBus } from '../../infra/bus';
import { TransactionControllerDecorator } from '../../../../app/controllers/decorators';
import { PostgresTransaction } from '../../../../infra/database/postgres';

export const makeSignUpController = (): Controller => {
  const postgres = new PostgresTransaction();
  const bus = makeBus(postgres);
  const userService = new UserServiceImpl(bus);
  const controller = new SignUpController(userService);

  const transaction = new TransactionControllerDecorator(controller, postgres);

  return transaction;
};
