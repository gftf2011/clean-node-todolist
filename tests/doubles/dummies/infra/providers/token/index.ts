import {
  TokenPayload,
  TokenProvider,
} from '../../../../../../src/app/contracts/providers';

export class TokenProviderDummy implements TokenProvider {
  sign: (data: TokenPayload) => string;

  verify: (token: string, secret: string) => any;
}
