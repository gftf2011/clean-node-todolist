import { ApplicationError } from './application';

export class UnfinishedNoteError extends ApplicationError {
  constructor(id: string) {
    super();
    this.message = `note: ${id} - was not finished yet`;
    this.name = UnfinishedNoteError.name;
  }
}
