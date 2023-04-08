import { DomainError } from './domain';

export class InvalidEmailError extends DomainError {
  constructor(value: string) {
    super();
    this.message = `email "${value || ''}" is not valid`;
    this.name = InvalidEmailError.name;
  }
}
