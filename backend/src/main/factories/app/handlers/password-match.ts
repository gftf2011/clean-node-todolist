import { PasswordMatchHandler } from '../../../../app/handlers';
import { HashFactory, HASH_FACTORIES } from '../../../../infra/providers';

export const makePasswordMatchHandler = (): PasswordMatchHandler => {
  const hash = new HashFactory().make(HASH_FACTORIES.SHA_521);
  const handler = new PasswordMatchHandler(hash);
  return handler;
};
