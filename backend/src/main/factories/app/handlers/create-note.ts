import { CreateNoteHandler } from '../../../../app/handlers';
import { PostgresTransaction } from '../../../../infra/database/postgres';
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

export const makeCreateNoteHandler = (): CreateNoteHandler => {
  const encryption = new EncryptionFactory(
    process.env.ENCRYPTION_KEY_AES_256_GCM,
    process.env.ENCRYPTION_IV_AES_256_GCM,
  ).make(ENCRYPTION_FACTORIES.AES_256_GCM);
  const sequencingProvider = new SequencingProviderImpl();

  const postgres = new DatabaseCircuitBreakerProxy(new PostgresTransaction());
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
