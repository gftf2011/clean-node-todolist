import { DatabaseTransaction } from '../../../../app/contracts/database';
import { CreateNoteHandler } from '../../../../app/handlers';
import { DatabaseCircuitBreakerProxy } from '../../../../infra/database/postgres/proxies';
import {
  EncryptionFactory,
  ENCRYPTION_FACTORIES,
  SequencingProviderImpl,
} from '../../../../infra/providers';
import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../infra/repositories';

export const makeCreateNoteHandler = (
  database?: DatabaseTransaction,
): CreateNoteHandler => {
  const encryption = new EncryptionFactory(
    process.env.ENCRYPTION_KEY_AES_256_CBC,
    process.env.ENCRYPTION_IV_AES_256_CBC,
  ).make(ENCRYPTION_FACTORIES.AES_256_CBC);
  const sequencingProvider = new SequencingProviderImpl();

  const postgres = new DatabaseCircuitBreakerProxy(database);
  const repositoryFactory = new RepositoriesConcreteFactory(postgres).make(
    REPOSITORIES_FACTORIES.REMOTE,
  );
  const noteRepository = repositoryFactory.createNoteRepository();

  const handler = new CreateNoteHandler(
    sequencingProvider,
    encryption,
    noteRepository,
  );

  return handler;
};
