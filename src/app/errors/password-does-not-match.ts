import { ApplicationError } from './application';

export class PasswordDoesNotMatchError extends ApplicationError {
  constructor() {
    super();
    this.message = `password does not match`;
    this.name = PasswordDoesNotMatchError.name;
  }
}
