import { DatabaseTransaction } from '../../../../app/contracts/database';
import { FindNotesByUserIdHandler } from '../../../../app/handlers';
import {
  DecryptionFactory,
  DECRYPTION_FACTORIES,
} from '../../../../infra/providers';
import {
  RepositoriesConcreteFactory,
  REPOSITORIES_FACTORIES,
} from '../../../../infra/repositories';
import { DatabaseCircuitBreakerProxy } from '../../../../infra/database/postgres/proxies';

export const makeFindNotesByUserIdHandler = (
  database?: DatabaseTransaction,
): FindNotesByUserIdHandler => {
  const postgres = new DatabaseCircuitBreakerProxy(database);
  const repositoryFactory = new RepositoriesConcreteFactory(postgres).make(
    REPOSITORIES_FACTORIES.REMOTE,
  );
  const noteRepository = repositoryFactory.createNoteRepository();
  const decryption = new DecryptionFactory(
    process.env.ENCRYPTION_KEY_AES_256_CBC,
    process.env.ENCRYPTION_IV_AES_256_CBC,
  ).make(DECRYPTION_FACTORIES.AES_256_CBC);
  const handler = new FindNotesByUserIdHandler(decryption, noteRepository);
  return handler;
};
