import { Either, left, right } from '../../shared';

import { WeakPasswordError } from '../errors';

export class Password {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  private static countOnlyNumbers(password: string): number {
    return password.replace(/(\D)/g, '').length;
  }

  private static countOnlyUpperCaseLetters(password: string): number {
    return password.replace(/([^A-Z]*)/g, '').length;
  }

  private static countOnlyLowerCaseLetters(password: string): number {
    return password.replace(/([^a-z]*)/g, '').length;
  }

  private static countOnlySpecialCharacters(password: string): number {
    return password.replace(/([^\\^!@#$%&?]*)/g, '').length;
  }

  private static hasEmptySpace(password: string): boolean {
    const PASSWORD_HAS_ANY_SPACE_REGEX = /(\s+)/g;

    return PASSWORD_HAS_ANY_SPACE_REGEX.test(password);
  }

  private static validate(password: string): boolean {
    if (
      password.length < 11 ||
      password.length > 24 ||
      Password.hasEmptySpace(password) ||
      Password.countOnlyNumbers(password) < 8 ||
      Password.countOnlyUpperCaseLetters(password) < 1 ||
      Password.countOnlyLowerCaseLetters(password) < 1 ||
      Password.countOnlySpecialCharacters(password) < 1
    ) {
      return false;
    }

    return true;
  }

  public get(): string {
    return this.value;
  }

  public static create(password: string): Either<Error, Password> {
    if (!password || !this.validate(password)) {
      return left(new WeakPasswordError());
    }
    return right(new Password(password));
  }
}
