/* eslint-disable max-classes-per-file */
/**
 * @author Otavio Lemos <otaviolemos@gmail.com>
 * @desc Left parameter from Either, usued to tell Either value is an Error
 *
 * It uses the {@link https://coolmonktechie.com/android-how-to-implement-either-monad-design-pattern-in-kotlin/ Either Monad} design pattern
 */
export class Left<L, A> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  /**
   * @author Otavio Lemos <otaviolemos@gmail.com>
   * @desc method responsible to tell class is an instance from Left
   * @returns {true} output telling if class is Left
   */
  isLeft(): this is Left<L, A> {
    return true;
  }

  /**
   * @author Otavio Lemos <otaviolemos@gmail.com>
   * @desc method responsible to tell class is an instance from Right
   * @returns {false} output telling if class is Right
   */
  isRight(): this is Right<L, A> {
    return false;
  }
}

/**
 * @author Otavio Lemos <otaviolemos@gmail.com>
 * @desc Right parameter from Either, usued to tell Either value is the expected one
 *
 * It uses the {@link https://coolmonktechie.com/android-how-to-implement-either-monad-design-pattern-in-kotlin/ Either Monad} design pattern
 */
export class Right<L, A> {
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }

  /**
   * @author Otavio Lemos <otaviolemos@gmail.com>
   * @desc method responsible to tell class is an instance from Left
   * @returns {false} output telling if class is Left
   */
  isLeft(): this is Left<L, A> {
    return false;
  }

  /**
   * @author Otavio Lemos <otaviolemos@gmail.com>
   * @desc method responsible to tell class is an instance from Right
   * @returns {true} output telling if class is Right
   */
  isRight(): this is Right<L, A> {
    return true;
  }
}

/**
 * @desc Either type, used to tell if the value either is an Error - Left, or the expected one - Right
 * @author Otavio Lemos <otaviolemos@gmail.com>
 */
export type Either<L, A> = Left<L, A> | Right<L, A>;

/**
 * @author Otavio Lemos <otaviolemos@gmail.com>
 * @desc method responsible to create a Left instance class
 * It uses the {@link https://www.tutorialspoint.com/design_pattern/factory_pattern.htm Factory} design pattern
 */
export const left = <L, A>(l: L): Either<L, A> => {
  return new Left<L, A>(l);
};

/**
 * @author Otavio Lemos <otaviolemos@gmail.com>
 * @desc method responsible to create a Right instance class
 * It uses the {@link https://www.tutorialspoint.com/design_pattern/factory_pattern.htm Factory} design pattern
 */
export const right = <L, A>(a: A): Either<L, A> => {
  return new Right<L, A>(a);
};
