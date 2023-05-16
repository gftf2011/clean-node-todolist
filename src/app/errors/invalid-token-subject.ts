import { ApplicationError } from './application';

export class InvalidTokenSubjectError extends ApplicationError {
  constructor() {
    super();
    this.message = `token subject is invalid`;
    this.name = InvalidTokenSubjectError.name;
  }
}
