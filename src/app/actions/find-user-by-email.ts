import { Action } from '../contracts/actions';

type FindUserByEmailData = {
  email: string;
};

// It uses the command design pattern
export class FindUserByEmailAction implements Action {
  readonly operation: string = 'find-user-by-email';

  constructor(public readonly data: FindUserByEmailData) {}
}
