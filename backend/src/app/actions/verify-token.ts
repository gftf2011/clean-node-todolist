import { Action } from '../contracts/actions';

type VeifyTokenData = {
  token: string;
};

export class VerifyTokenAction implements Action {
  readonly operation: string = 'verify-token';

  constructor(public readonly data: VeifyTokenData) {}
}
