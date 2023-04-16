import { Action } from '../contracts/actions';

type FindNotesByUserIdData = {
  userId: string;
  page: number;
  limit: number;
};

// It uses the command design pattern
export class FindNotesByUserIdAction implements Action {
  readonly operation: string = 'find-notes-by-user-id';

  constructor(public readonly data: FindNotesByUserIdData) {}
}
