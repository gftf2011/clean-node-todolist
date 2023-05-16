import { Action } from '../contracts/actions';

type FindUserData = {
  id: string;
};

// It uses the command design pattern
export class FindUserAction implements Action {
  readonly operation: string = 'find-user';

  constructor(public readonly data: FindUserData) {}
}
