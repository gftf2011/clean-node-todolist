import { Either, left, right } from '../../shared';
import { InvalidDescriptionError } from '../errors';

export class Description {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  private static validate(description: string): boolean {
    if (description.length === 0 || description.length > 1000) {
      return false;
    }
    return true;
  }

  public get(): string {
    return this.value;
  }

  public static create(description: string): Either<Error, Description> {
    if (!description || !this.validate(description.trim())) {
      return left(new InvalidDescriptionError(description));
    }
    return right(new Description(description.trim()));
  }
}
