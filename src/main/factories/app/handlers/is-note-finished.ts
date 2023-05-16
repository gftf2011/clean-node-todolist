import { DatabaseTransaction } from '../../../../app/contracts/database';
import { IsNoteFinishedHandler } from '../../../../app/handlers';
import {
  RepositoriesConcreteFactory,
  REPOSITORIES_FACTORIES,
} from '../../../../infra/repositories';
import { DatabaseCircuitBreakerProxy } from '../../../../infra/database/postgres/proxies';

export const makeIsNoteFinishedHandler = (
  database?: DatabaseTransaction,
): IsNoteFinishedHandler => {
  const postgres = new DatabaseCircuitBreakerProxy(database);
  const repositoryFactory = new RepositoriesConcreteFactory(postgres).make(
    REPOSITORIES_FACTORIES.REMOTE,
  );
  const noteRepository = repositoryFactory.createNoteRepository();
  const handler = new IsNoteFinishedHandler(noteRepository);
  return handler;
};
