import { Description } from '../../../../src/domain/value-objects';
import { InvalidDescriptionError } from '../../../../src/domain/errors';

describe('Description - Value Object', () => {
  it('should return "InvalidDescriptionError" if description is "null"', () => {
    const response = Description.create(null as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidDescriptionError(null as any));
  });

  it('should return "InvalidDescriptionError" if description is "undefined"', () => {
    const response = Description.create(undefined as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(
      new InvalidDescriptionError(undefined as any),
    );
  });

  it('should return "InvalidDescriptionError" if description is empty string', () => {
    const response = Description.create('');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidDescriptionError(''));
  });

  it('should return "InvalidDescriptionError" if description has only white spaces', () => {
    const description = ' ';
    const response = Description.create(description);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidDescriptionError(description));
  });

  it('should return "InvalidDescriptionError" if description has more than 1000 characters', () => {
    const description = 'a'.repeat(1001);
    const response = Description.create(description);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidDescriptionError(description));
  });

  it('should return "Description" with valid parameter', () => {
    const value = 'a'.repeat(1000);
    const response = Description.create(value);

    const description = response.value as Description;

    expect(response.isRight()).toBeTruthy();
    expect(description.get()).toBe(value);
  });
});
