import { ApplicationError } from './application';

export class UserAlreadyExistsError extends ApplicationError {
  constructor() {
    super();
    this.message = `user already exists`;
    this.name = UserAlreadyExistsError.name;
  }
}
