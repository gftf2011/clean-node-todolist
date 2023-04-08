import { Either, left, right } from '../../../shared';

import { InvalidEmailError } from '../../errors';

/**
 * Constants
 */
const EMAIL_ADDRESS_SEPARATOR = '@';
const EMAIL_DOMAIN_SEPARATOR = '.';
/**
 * @desc Email regex
 * @author Esteban Küber
 * @link https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
 */
const VALID_EMAIL_REGEX =
  /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export class Email {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  private static validate(email: string): boolean {
    if (email.length > 320) {
      return false;
    }
    if (!VALID_EMAIL_REGEX.test(email)) {
      return false;
    }
    const account = email.split(EMAIL_ADDRESS_SEPARATOR)[0];
    const address = email.split(EMAIL_ADDRESS_SEPARATOR)[1];
    if (account.length > 64) {
      return false;
    }
    if (address.length > 255) {
      return false;
    }
    const addresses = address.split(EMAIL_DOMAIN_SEPARATOR);
    if (addresses.some(part => part.length > 127)) {
      return false;
    }
    return true;
  }

  public account(): string {
    return this.value.split(EMAIL_ADDRESS_SEPARATOR)[0];
  }

  public address(): string {
    return this.value.split(EMAIL_ADDRESS_SEPARATOR)[1];
  }

  public get(): string {
    return this.value;
  }

  public static create(email: string): Either<Error, Email> {
    if (
      !email ||
      !this.validate(email.toLocaleLowerCase().trim().replace(/(\s)/gm, ' '))
    ) {
      return left(new InvalidEmailError(email));
    }
    return right(
      new Email(email.toLocaleLowerCase().trim().replace(/(\s)/gm, ' ')),
    );
  }
}
