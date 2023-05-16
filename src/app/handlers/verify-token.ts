import { Either, left, right } from '../../shared';
import { VerifyTokenAction } from '../actions';
import { Handler } from '../contracts/handlers';
import { TokenProvider } from '../contracts/providers';
import { TokenExpiredError } from '../errors';

export class VerifyTokenHandler
  implements Handler<{ id: string; sub: string }>
{
  operation = 'verify-token';

  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly secret: string,
  ) {}

  private verifyTokenExpiration(
    jwt: string,
  ): Either<Error, { id: string; sub: string }> {
    try {
      const token: { id: string; sub: string } = this.tokenProvider.verify(
        jwt,
        this.secret,
      );
      return right(token);
    } catch (err) {
      return left(new TokenExpiredError());
    }
  }

  public async handle(
    input: VerifyTokenAction,
  ): Promise<{ id: string; sub: string }> {
    const jwt = input.data.token.split('Bearer ')[1];
    const tokenOrError = this.verifyTokenExpiration(jwt);
    if (tokenOrError.isLeft()) {
      throw tokenOrError.value;
    }
    return tokenOrError.value;
  }
}
