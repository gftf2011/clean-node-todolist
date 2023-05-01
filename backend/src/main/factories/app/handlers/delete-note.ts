import { DeleteNoteHandler } from '../../../../app/handlers';
import { PostgresTransaction } from '../../../../infra/database/postgres';
import { DatabaseCircuitBreakerProxy } from '../../../../infra/database/postgres/proxies';
import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../infra/repositories';

export const makeDeleteNoteHandler = (): DeleteNoteHandler => {
  const postgres = new DatabaseCircuitBreakerProxy(new PostgresTransaction());
  const repositoryFactory = new RepositoriesConcreteFactory(postgres).make(
    REPOSITORIES_FACTORIES.REMOTE,
  );
  const noteRepository = repositoryFactory.createNoteRepository();

  const handler = new DeleteNoteHandler(noteRepository);

  return handler;
};
