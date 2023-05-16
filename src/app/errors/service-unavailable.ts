import { ApplicationError } from './application';

export class ServiceUnavailableError extends ApplicationError {
  constructor() {
    super();
    this.message = `service not available in the moment, please try again later`;
    this.name = ServiceUnavailableError.name;
  }
}
