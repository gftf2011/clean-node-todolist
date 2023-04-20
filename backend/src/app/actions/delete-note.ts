import { Action } from '../contracts/actions';

type DeleteNoteData = {
  id: string;
};

// It uses the command design pattern
export class DeleteNoteAction implements Action {
  readonly operation: string = 'delete-note';

  constructor(public readonly data: DeleteNoteData) {}
}
