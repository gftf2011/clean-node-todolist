import { InvalidNameError } from '../errors';

import { Either, left, right } from '../../shared';

export class Name {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public get(): string {
    return this.value;
  }

  private static validate(name: string): boolean {
    if (name.length < 2 || name.length > 255) {
      return false;
    }
    return true;
  }

  public static create(name: string): Either<Error, Name> {
    if (!name || !this.validate(name.toLocaleLowerCase().trim())) {
      return left(new InvalidNameError(name));
    }
    return right(new Name(name.toLocaleLowerCase().trim()));
  }
}
