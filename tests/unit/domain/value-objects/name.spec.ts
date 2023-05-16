import faker from 'faker';

import { InvalidNameError } from '../../../../src/domain/errors';
import { Name } from '../../../../src/domain/value-objects';

describe('Name - Value Object', () => {
  it('should return "InvalidNameError" if name is "null"', () => {
    const response = Name.create(null as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(null as any));
  });

  it('should return "InvalidNameError" if name is "undefined"', () => {
    const response = Name.create(undefined as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(undefined as any));
  });

  it('should return "InvalidNameError" if name is empty string', () => {
    const response = Name.create('');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(''));
  });

  it('should return "InvalidNameError" if name has only white spaces', () => {
    const name = ' ';
    const response = Name.create(name);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(name));
  });

  it('should return "InvalidNameError" if name has only 1 character', () => {
    const name = 'a';
    const response = Name.create(name);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(name));
  });

  it('should return "InvalidNameError" if name has more than 255 character', () => {
    const name = 'a'.repeat(256);
    const response = Name.create(name);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(name));
  });

  it('should return "Name" with valid parameter', () => {
    const value = faker.lorem.word(2).toLowerCase();
    const response = Name.create(value);

    const name = response.value as Name;

    expect(response.isRight()).toBeTruthy();
    expect(name.get()).toBe(value);
  });

  it('should return "Name" with valid uppercase parameter', () => {
    const value = 'AA';
    const response = Name.create(value);

    const name = response.value as Name;

    expect(response.isRight()).toBeTruthy();
    expect(name.get()).toBe('aa');
  });
});
