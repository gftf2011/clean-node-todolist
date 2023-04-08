import { Handler } from '../contracts/handlers';
import { PasswordMatchAction } from '../actions';
import { HashProvider } from '../contracts/providers';

export class PasswordMatchHandler implements Handler<boolean> {
  readonly operation: string = 'password-match';

  constructor(private readonly hash: HashProvider) {}

  public async handle(action: PasswordMatchAction): Promise<boolean> {
    const { email, hashedPassword, password } = action.data;
    const newHashedPassword = await this.hash.encode(password, email);
    return newHashedPassword === hashedPassword;
  }
}
