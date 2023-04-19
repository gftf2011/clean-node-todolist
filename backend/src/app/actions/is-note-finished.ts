import { Action } from '../contracts/actions';

type IsNoteFinishedData = {
  id: string;
  finished: boolean;
};

// It uses the command design pattern
export class IsNoteFinishedAction implements Action {
  readonly operation: string = 'is-note-finished';

  constructor(public readonly data: IsNoteFinishedData) {}
}
