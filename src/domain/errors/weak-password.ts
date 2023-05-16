import { DomainError } from './domain';

export class WeakPasswordError extends DomainError {
  constructor() {
    super();
    this.message = `password is not strong enough`;
    this.name = WeakPasswordError.name;
  }
}
