import { DomainError } from './domain';

export class InvalidDescriptionError extends DomainError {
  constructor(value: string) {
    super();
    this.message = `description: "${value || ''}" - is not valid`;
    this.name = InvalidDescriptionError.name;
  }
}
