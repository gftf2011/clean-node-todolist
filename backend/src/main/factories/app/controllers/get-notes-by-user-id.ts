import { Controller } from '../../../../app/contracts/controllers';
import { GetNotesByUserIdController } from '../../../../app/controllers';
import { NoteServiceImpl, UserServiceImpl } from '../../../../app/services';
import { makeBus } from '../../infra/bus';
import { TransactionControllerDecorator } from '../../../../app/controllers/decorators';
import { PostgresTransaction } from '../../../../infra/database/postgres';

export const makeGetNotesByUserIdController = (): Controller => {
  const postgres = new PostgresTransaction();
  const bus = makeBus(postgres);
  const userService = new UserServiceImpl(bus);
  const noteService = new NoteServiceImpl(bus);
  const controller = new GetNotesByUserIdController(noteService, userService);

  const transaction = new TransactionControllerDecorator(controller, postgres);

  return transaction;
};
