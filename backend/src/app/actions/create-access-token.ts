import { Action } from '../contracts/actions';

type CreateAccessTokenData = {
  id: string;
  email: string;
};

// It uses the command design pattern
export class CreateAccessTokenAction implements Action {
  readonly operation: string = 'create-access-token';

  constructor(public readonly data: CreateAccessTokenData) {}
}
