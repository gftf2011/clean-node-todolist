import { ApplicationError } from './application';

export class InvalidSequencingDomainError extends ApplicationError {
  constructor(value: string) {
    super();
    this.message = `sequencing domain: ${value} - is not valid or mapped`;
    this.name = InvalidSequencingDomainError.name;
  }
}
