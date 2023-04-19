import { UpdateNoteHandler } from '../../../../app/handlers';
import { PostgresTransaction } from '../../../../infra/database/postgres';
import {
  EncryptionFactory,
  ENCRYPTION_FACTORIES,
} from '../../../../infra/providers';
import {
  RepositoriesConcreteFactory,
  REPOSITORIES_FACTORIES,
} from '../../../../infra/repositories';
import { DatabaseCircuitBreakerProxy } from '../../../../infra/database/postgres/proxies';

export const makeUpdateNoteHandler = (): UpdateNoteHandler => {
  const postgres = new DatabaseCircuitBreakerProxy(new PostgresTransaction());
  const repositoryFactory = new RepositoriesConcreteFactory(postgres).make(
    REPOSITORIES_FACTORIES.REMOTE,
  );
  const noteRepository = repositoryFactory.createNoteRepository();
  const encryption = new EncryptionFactory(
    process.env.ENCRYPTION_KEY_AES_256_GCM,
    process.env.ENCRYPTION_IV_AES_256_GCM,
  ).make(ENCRYPTION_FACTORIES.AES_256_GCM);
  const handler = new UpdateNoteHandler(encryption, noteRepository);
  return handler;
};
