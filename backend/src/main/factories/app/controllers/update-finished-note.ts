import { Controller } from '../../../../app/contracts/controllers';
import { UpdateFinishedNoteController } from '../../../../app/controllers';
import { NoteServiceImpl, UserServiceImpl } from '../../../../app/services';
import { makeBus } from '../../infra/bus';
import { TransactionControllerDecorator } from '../../../../app/controllers/decorators';
import { PostgresTransaction } from '../../../../infra/database/postgres';

export const makeUpdateFinishedNoteController = (): Controller => {
  const postgres = new PostgresTransaction();
  const bus = makeBus();
  const userService = new UserServiceImpl(bus);
  const noteService = new NoteServiceImpl(bus);
  const controller = new UpdateFinishedNoteController(noteService, userService);

  const transaction = new TransactionControllerDecorator(controller, postgres);

  return transaction;
};
