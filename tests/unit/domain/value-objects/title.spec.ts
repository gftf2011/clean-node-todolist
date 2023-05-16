import { Title } from '../../../../src/domain/value-objects';
import { InvalidTitleError } from '../../../../src/domain/errors';

describe('Title - Value Object', () => {
  it('should return "InvalidTitleError" if title is "null"', () => {
    const response = Title.create(null as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTitleError(null as any));
  });

  it('should return "InvalidTitleError" if title is "undefined"', () => {
    const response = Title.create(undefined as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTitleError(undefined as any));
  });

  it('should return "InvalidTitleError" if title is empty string', () => {
    const response = Title.create('');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTitleError(''));
  });

  it('should return "InvalidTitleError" if title has only white spaces', () => {
    const title = ' ';
    const response = Title.create(title);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTitleError(title));
  });

  it('should return "InvalidTitleError" if title has more than 120 characters', () => {
    const title = 'a'.repeat(121);
    const response = Title.create(title);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTitleError(title));
  });

  it('should return "Title" with valid parameter', () => {
    const value = 'a'.repeat(120);
    const response = Title.create(value);

    const title = response.value as Title;

    expect(response.isRight()).toBeTruthy();
    expect(title.get()).toBe(value);
  });
});
