import { DomainError } from './domain';

export class InvalidTitleError extends DomainError {
  constructor(value: string) {
    super();
    this.message = `title: "${value || ''}" - is not valid`;
    this.name = InvalidTitleError.name;
  }
}
