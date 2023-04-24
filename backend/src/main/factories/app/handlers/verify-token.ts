import { VerifyTokenHandler } from '../../../../app/handlers';
import { TokenProviderImpl } from '../../../../infra/providers';

export const makeVerifyTokenHandler = (): VerifyTokenHandler => {
  const tokenProvider = new TokenProviderImpl(
    Number(process.env.JWT_EXPIRATION_TIME),
  );
  const handler = new VerifyTokenHandler(tokenProvider, process.env.JWT_SECRET);
  return handler;
};