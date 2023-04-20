import { Handler } from '../contracts/handlers';
import { CreateAccessTokenAction } from '../actions';
import { TokenProvider } from '../contracts/providers';

export class CreateAccessTokenHandler implements Handler<string> {
  readonly operation: string = 'create-access-token';

  constructor(
    private readonly token: TokenProvider,
    private readonly secret: string,
  ) {}

  public async handle(action: CreateAccessTokenAction): Promise<string> {
    const { id, email } = action.data;

    const token = this.token.sign({
      payload: { id },
      secret: this.secret,
      subject: email,
    });

    return token;
  }
}
