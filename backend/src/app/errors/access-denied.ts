import { ApplicationError } from './application';

export class AccessDeniedError extends ApplicationError {
  constructor() {
    super();
    this.message = `invalid authorization to access resource`;
    this.name = AccessDeniedError.name;
  }
}
