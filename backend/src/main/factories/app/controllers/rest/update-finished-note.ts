import { Controller } from '../../../../../app/contracts/controllers';
import { UpdateFinishedNoteHttpController } from '../../../../../app/controllers/rest';
import { NoteServiceImpl, UserServiceImpl } from '../../../../../app/services';
import { makeBus } from '../../../infra/bus';
import { TransactionControllerDecorator } from '../../../../../app/controllers/decorators';
import { PostgresTransaction } from '../../../../../infra/database/postgres';

export const makeUpdateFinishedNoteHttpController = (): Controller => {
  const postgres = new PostgresTransaction();
  const bus = makeBus(postgres);
  const userService = new UserServiceImpl(bus);
  const noteService = new NoteServiceImpl(bus);
  const controller = new UpdateFinishedNoteHttpController(
    noteService,
    userService,
  );

  const transaction = new TransactionControllerDecorator(controller, postgres);

  return transaction;
};
