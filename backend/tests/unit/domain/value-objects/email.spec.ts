import faker from 'faker';

import { Email } from '../../../../src/domain/value-objects';

import { InvalidEmailError } from '../../../../src/domain/errors';

describe('Email - Value Object', () => {
  it('should return "InvalidEmailError" if email is "null"', () => {
    const response = Email.create(null as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(null as any));
  });

  it('should return "InvalidEmailError" if email is "undefined"', () => {
    const response = Email.create(undefined as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(undefined as any));
  });

  it('should return "InvalidEmailError" if email is empty string', () => {
    const response = Email.create('');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(''));
  });

  it('should return "InvalidEmailError" if email has more than 320 characters', () => {
    const email = 'a'.repeat(321);
    const response = Email.create(email);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should return "InvalidEmailError" if email has invalid pattern', () => {
    let email = 'test.@mail.com';
    let response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = 't..est@mail.com';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = '@mail.com';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = 'test@';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = 'test@mail';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = 'test@mail..com';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = 'test@.mail.com';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = '.test@mail.com';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = 'test@mail.com.';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should return "InvalidEmailError" if email domain has more than 255 characters', () => {
    const email = `${'a'.repeat(63)}@${'d'.repeat(127)}.${'d'.repeat(128)}`;
    const response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should return "InvalidEmailError" if email domain part has more than 127 characters', () => {
    const email = `${'a'.repeat(64)}@${'d'.repeat(128)}.${'d'.repeat(126)}`;
    const response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should return "InvalidEmailError" if email account has more than 64 characters', () => {
    const email = `${'a'.repeat(65)}@${'d'.repeat(127)}.${'d'.repeat(126)}`;
    const response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should return "Email" with valid parameter', () => {
    const value = faker.internet.email().toLowerCase();
    const response = Email.create(value);

    const email = response.value as Email;

    expect(response.isRight()).toBeTruthy();
    expect(email.get()).toBe(value);
    expect(email.account()).toBe(value.split('@')[0]);
    expect(email.address()).toBe(value.split('@')[1]);
  });

  it('should return "Email" with valid uppercase parameter', () => {
    const value = 'TES.T@MAIL.COM';
    const response = Email.create(value);

    const email = response.value as Email;

    expect(response.isRight()).toBeTruthy();
    expect(email.get()).toBe('tes.t@mail.com');
    expect(email.account()).toBe('tes.t');
    expect(email.address()).toBe('mail.com');
  });
});
