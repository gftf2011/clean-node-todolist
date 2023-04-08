import { Either, left, right } from '../../../shared';
import { InvalidIdError } from '../../errors';

const VALID_ID_REGEX = /^([0-9]{17})-([0-9a-f]{32})-([0-9a-f]{32})$/;

export class ID {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  private static validate(id: string): boolean {
    if (!VALID_ID_REGEX.test(id)) {
      return false;
    }

    return true;
  }

  public get(): string {
    return this.value;
  }

  public static create(id: string): Either<Error, ID> {
    if (!id || !this.validate(id)) {
      return left(new InvalidIdError(id));
    }
    return right(new ID(id));
  }
}
