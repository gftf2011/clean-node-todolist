import { Action } from '../contracts/actions';

type FindNoteData = {
  id: string;
};

// It uses the command design pattern
export class FindNoteAction implements Action {
  readonly operation: string = 'find-note';

  constructor(public readonly data: FindNoteData) {}
}
