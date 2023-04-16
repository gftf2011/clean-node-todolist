import { WeakPasswordError } from '../../../../src/domain/errors';
import { Password } from '../../../../src/domain/value-objects';

describe('Password - Value Object', () => {
  it('should return "WeakPasswordError" if password is "null"', () => {
    const response = Password.create(null as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new WeakPasswordError());
  });

  it('should return "WeakPasswordError" if password is "undefined"', () => {
    const response = Password.create(undefined as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new WeakPasswordError());
  });

  it('should return "WeakPasswordError" if password is empty string', () => {
    const response = Password.create('');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new WeakPasswordError());
  });

  it('should return "WeakPasswordError" if password has less than 11 characters', () => {
    const response = Password.create('aaaaaaaaaa');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new WeakPasswordError());
  });

  it('should return "WeakPasswordError" if password has more than 24 characters', () => {
    const response = Password.create('a'.repeat(25));
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new WeakPasswordError());
  });

  it('should return "WeakPasswordError" if password has any empty space', () => {
    const response = Password.create('aaaaaa aaaa');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new WeakPasswordError());
  });

  it('should return "WeakPasswordError" if password has less than 8 numeric values', () => {
    const response = Password.create('1234567aaaa');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new WeakPasswordError());
  });

  it('should return "WeakPasswordError" if password has less than 1 uppercase letter', () => {
    const response = Password.create('12345678aaa');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new WeakPasswordError());
  });

  it('should return "WeakPasswordError" if password has less than 1 lowercase letter', () => {
    const response = Password.create('12345678AAA');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new WeakPasswordError());
  });

  it('should return "WeakPasswordError" if password has less than 1 special character - (^!@#$%&?)', () => {
    const response = Password.create('12345678aaA');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new WeakPasswordError());
  });

  it('should return valid "Password" with valid parameter', () => {
    const value = '12345678a?B';
    const response = Password.create(value);
    const password = response.value as Password;

    expect(response.isRight()).toBeTruthy();
    expect(password.get()).toBe(value);
  });
});
