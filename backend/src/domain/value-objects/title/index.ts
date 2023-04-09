import { Either, left, right } from '../../../shared';
import { InvalidTitleError } from '../../errors';

export class Title {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  private static validate(title: string): boolean {
    if (title.length === 0 || title.length > 120) {
      return false;
    }
    return true;
  }

  public get(): string {
    return this.value;
  }

  public static create(title: string): Either<Error, Title> {
    if (!title || !this.validate(title.trim().replace(/(\s)/gm, ' '))) {
      return left(new InvalidTitleError(title));
    }
    return right(new Title(title.trim().replace(/(\s)/gm, ' ')));
  }
}
