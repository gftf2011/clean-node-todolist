import { DatabaseTransaction } from '../../../../app/contracts/database';
import { CreateAccessTokenHandler } from '../../../../app/handlers';
import { TokenProviderImpl } from '../../../../infra/providers';

export const makeCreateAccessTokenHandler = (
  database?: DatabaseTransaction,
): CreateAccessTokenHandler => {
  const tokenProvider = new TokenProviderImpl(
    Number(process.env.JWT_EXPIRATION_TIME),
  );
  const handler = new CreateAccessTokenHandler(
    tokenProvider,
    process.env.JWT_SECRET,
  );

  return handler;
};
