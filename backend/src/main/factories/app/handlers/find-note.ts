import { FindNoteHandler } from '../../../../app/handlers';
import { PostgresTransaction } from '../../../../infra/database/postgres';
import {
  DecryptionFactory,
  DECRYPTION_FACTORIES,
} from '../../../../infra/providers';
import {
  RepositoriesConcreteFactory,
  REPOSITORIES_FACTORIES,
} from '../../../../infra/repositories';
import { DatabaseCircuitBreakerProxy } from '../../../../infra/database/postgres/proxies';

export const makeFindNoteHandler = (): FindNoteHandler => {
  const postgres = new DatabaseCircuitBreakerProxy(new PostgresTransaction());
  const repositoryFactory = new RepositoriesConcreteFactory(postgres).make(
    REPOSITORIES_FACTORIES.REMOTE,
  );
  const noteRepository = repositoryFactory.createNoteRepository();
  const decryption = new DecryptionFactory(
    process.env.ENCRYPTION_KEY_AES_256_GCM,
    process.env.ENCRYPTION_IV_AES_256_GCM,
  ).make(DECRYPTION_FACTORIES.AES_256_GCM);
  const handler = new FindNoteHandler(decryption, noteRepository);
  return handler;
};
