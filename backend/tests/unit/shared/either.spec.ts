import { Either, left, right } from '../../../src/shared';

describe('Either', () => {
  it('should return left side value', () => {
    const { isLeft, isRight, value }: Either<Error, boolean> = left(
      new Error(),
    );

    expect(isLeft()).toBeTruthy();
    expect(isRight()).toBeFalsy();
    expect(value).toEqual(new Error());
  });

  it('should return right side value', () => {
    const { isLeft, isRight, value }: Either<Error, boolean> = right(true);

    expect(isLeft()).toBeFalsy();
    expect(isRight()).toBeTruthy();
    expect(value).toBe(true);
  });
});
