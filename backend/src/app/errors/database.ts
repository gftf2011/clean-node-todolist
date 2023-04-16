import { ApplicationError } from './application';

export class DatabaseError extends ApplicationError {
  constructor() {
    super();
    this.message = `database internal error`;
    this.name = DatabaseError.name;
  }
}
