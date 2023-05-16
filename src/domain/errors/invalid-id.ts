import { DomainError } from './domain';

export class InvalidIdError extends DomainError {
  constructor(value: string) {
    super();
    this.message = `ID: ${value} - does not have a valid format`;
    this.name = InvalidIdError.name;
  }
}
