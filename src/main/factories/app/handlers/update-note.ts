import { DatabaseTransaction } from '../../../../app/contracts/database';
import { UpdateNoteHandler } from '../../../../app/handlers';
import {
  EncryptionFactory,
  ENCRYPTION_FACTORIES,
} from '../../../../infra/providers';
import {
  RepositoriesConcreteFactory,
  REPOSITORIES_FACTORIES,
} from '../../../../infra/repositories';
import { DatabaseCircuitBreakerProxy } from '../../../../infra/database/postgres/proxies';

export const makeUpdateNoteHandler = (
  database?: DatabaseTransaction,
): UpdateNoteHandler => {
  const postgres = new DatabaseCircuitBreakerProxy(database);
  const repositoryFactory = new RepositoriesConcreteFactory(postgres).make(
    REPOSITORIES_FACTORIES.REMOTE,
  );
  const noteRepository = repositoryFactory.createNoteRepository();
  const encryption = new EncryptionFactory(
    process.env.ENCRYPTION_KEY_AES_256_CBC,
    process.env.ENCRYPTION_IV_AES_256_CBC,
  ).make(ENCRYPTION_FACTORIES.AES_256_CBC);
  const handler = new UpdateNoteHandler(encryption, noteRepository);
  return handler;
};
