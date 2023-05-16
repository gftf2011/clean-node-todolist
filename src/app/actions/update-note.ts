import { Action } from '../contracts/actions';

type UpdateNoteData = {
  id: string;
  title: string;
  description: string;
};

// It uses the command design pattern
export class UpdateNoteAction implements Action {
  readonly operation: string = 'update-note';

  constructor(public readonly data: UpdateNoteData) {}
}
