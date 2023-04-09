import { DomainError } from './domain';

export class InvalidNameError extends DomainError {
  constructor(value: string) {
    super();
    this.message = `name "${value || ''}" is not valid`;
    this.name = InvalidNameError.name;
  }
}
