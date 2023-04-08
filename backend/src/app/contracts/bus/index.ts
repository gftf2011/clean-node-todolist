import { Action } from '../actions';

export interface Bus<T = any> {
  execute: (action: Action) => Promise<T>;
}
