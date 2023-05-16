import { Action } from '../contracts/actions';

type CreateNoteData = {
  title: string;
  description: string;
  userId: string;
};

// It uses the command design pattern
export class CreateNoteAction implements Action {
  readonly operation: string = 'create-note';

  constructor(public readonly data: CreateNoteData) {}
}
