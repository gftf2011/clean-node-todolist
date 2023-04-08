import { Action } from '../actions';

export interface Handler<T = any> {
  readonly operation: string;
  handle: (input: Action) => Promise<T>;
}
