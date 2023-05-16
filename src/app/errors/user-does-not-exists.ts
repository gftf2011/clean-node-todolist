import { ApplicationError } from './application';

export class UserDoesNotExistsError extends ApplicationError {
  constructor() {
    super();
    this.message = `user does not exists`;
    this.name = UserDoesNotExistsError.name;
  }
}
