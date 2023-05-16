import { DomainError } from './domain';

export class InvalidLastnameError extends DomainError {
  constructor(value: string) {
    super();
    this.message = `lastname "${value || ''}" is not valid`;
    this.name = InvalidLastnameError.name;
  }
}
