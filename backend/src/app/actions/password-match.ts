import { Action } from '../contracts/actions';

type PasswordMatchData = {
  email: string;
  password: string;
  hashedPassword: string;
};

// It uses the command design pattern
export class PasswordMatchAction implements Action {
  readonly operation: string = 'password-match';

  constructor(public readonly data: PasswordMatchData) {}
}
