import { InvalidLastnameError } from '../errors';

import { Either, left, right } from '../../shared';

export class Lastname {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public get(): string {
    return this.value;
  }

  private static validate(lastname: string): boolean {
    if (lastname.length < 2 || lastname.length > 255) {
      return false;
    }
    return true;
  }

  public static create(lastname: string): Either<Error, Lastname> {
    if (!lastname || !this.validate(lastname.toLocaleLowerCase().trim())) {
      return left(new InvalidLastnameError(lastname));
    }
    return right(new Lastname(lastname.toLocaleLowerCase().trim()));
  }
}
