import faker from 'faker';

import { InvalidLastnameError } from '../../../../src/domain/errors';
import { Lastname } from '../../../../src/domain/value-objects';

describe('Lastname - Value Object', () => {
  it('should return "InvalidLastnameError" if lastname is "null"', () => {
    const response = Lastname.create(null as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidLastnameError(null as any));
  });

  it('should return "InvalidLastnameError" if lastname is "undefined"', () => {
    const response = Lastname.create(undefined as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidLastnameError(undefined as any));
  });

  it('should return "InvalidLastnameError" if lastname is empty string', () => {
    const response = Lastname.create('');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidLastnameError(''));
  });

  it('should return "InvalidLastnameError" if lastname has only white spaces', () => {
    const lastname = ' ';
    const response = Lastname.create(lastname);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidLastnameError(lastname));
  });

  it('should return "InvalidLastnameError" if lastname has only 1 character', () => {
    const lastname = 'a';
    const response = Lastname.create(lastname);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidLastnameError(lastname));
  });

  it('should return "InvalidLastnameError" if lastname has more than 255 character', () => {
    const lastname = 'a'.repeat(256);
    const response = Lastname.create(lastname);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidLastnameError(lastname));
  });

  it('should return "Lastname" with valid parameter', () => {
    const value = faker.lorem.word(2).toLowerCase();
    const response = Lastname.create(value);

    const lastname = response.value as Lastname;

    expect(response.isRight()).toBeTruthy();
    expect(lastname.get()).toBe(value);
  });

  it('should return "Lastname" with valid uppercase parameter', () => {
    const value = 'AA';
    const response = Lastname.create(value);

    const lastname = response.value as Lastname;

    expect(response.isRight()).toBeTruthy();
    expect(lastname.get()).toBe('aa');
  });
});
