import { ID } from '../../../../src/domain/value-objects';

import { InvalidIdError } from '../../../../src/domain/errors';

describe('ID - Value Object', () => {
  it('should return "InvalidIdError" if id is "null"', () => {
    const response = ID.create(null as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidIdError(null as any));
  });

  it('should return "InvalidIdError" if id is "undefined"', () => {
    const response = ID.create(undefined as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidIdError(undefined as any));
  });

  it('should return "InvalidIdError" if id is empty string', () => {
    const response = ID.create('');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidIdError(''));
  });

  it('should return "InvalidIdError" if id format is invalid', () => {
    const value = `${'0'.repeat(16)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const response = ID.create(value);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidIdError(value));
  });

  it('should return "ID" with valid parameter', () => {
    const value = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const response = ID.create(value);

    const id = response.value as ID;

    expect(response.isRight()).toBeTruthy();
    expect(id.get()).toBe(value);
  });
});
