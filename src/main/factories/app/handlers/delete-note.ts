import { DatabaseTransaction } from '../../../../app/contracts/database';
import { DeleteNoteHandler } from '../../../../app/handlers';
import { DatabaseCircuitBreakerProxy } from '../../../../infra/database/postgres/proxies';
import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../infra/repositories';

export const makeDeleteNoteHandler = (
  database?: DatabaseTransaction,
): DeleteNoteHandler => {
  const postgres = new DatabaseCircuitBreakerProxy(database);
  const repositoryFactory = new RepositoriesConcreteFactory(postgres).make(
    REPOSITORIES_FACTORIES.REMOTE,
  );
  const noteRepository = repositoryFactory.createNoteRepository();

  const handler = new DeleteNoteHandler(noteRepository);

  return handler;
};
