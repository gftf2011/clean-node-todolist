import { ApplicationError } from './application';

export class NoteNotFoundError extends ApplicationError {
  constructor(id: string) {
    super();
    this.message = `note: ${id} - was not found`;
    this.name = NoteNotFoundError.name;
  }
}
