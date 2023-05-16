import faker from 'faker';

import { User } from '../../../../src/domain/entity';
import {
  InvalidEmailError,
  InvalidIdError,
  InvalidLastnameError,
  InvalidNameError,
  WeakPasswordError,
} from '../../../../src/domain/errors';

describe('User - Entity', () => {
  it('should return "InvalidIdError" if id is invalid', () => {
    const response = User.create('', {
      email: faker.internet.email().toLowerCase(),
      lastname: 'test',
      name: 'test',
      password: '12345678aB?',
    });
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidIdError(''));
  });

  it('should return "InvalidNameError" if name is invalid', () => {
    const response = User.create(
      `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      {
        email: faker.internet.email().toLowerCase(),
        lastname: 'test',
        name: '',
        password: '12345678aB?',
      },
    );
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(''));
  });

  it('should return "InvalidLastnameError" if lastname is invalid', () => {
    const response = User.create(
      `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      {
        email: faker.internet.email().toLowerCase(),
        lastname: '',
        name: 'test',
        password: '12345678aB?',
      },
    );
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidLastnameError(''));
  });

  it('should return "InvalidEmailError" if email is invalid', () => {
    const response = User.create(
      `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      {
        email: '',
        lastname: 'test',
        name: 'test',
        password: '12345678aB?',
      },
    );
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(''));
  });

  it('should return "WeakPasswordError" if password is invalid', () => {
    const response = User.create(
      `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      {
        email: faker.internet.email().toLowerCase(),
        lastname: 'test',
        name: 'test',
        password: '',
      },
    );
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new WeakPasswordError());
  });

  it('should return "User" with valid parameters', () => {
    const email = faker.internet.email().toLowerCase();

    const response = User.create(
      `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      {
        email,
        lastname: 'test',
        name: 'test',
        password: '12345678aB?',
      },
    );

    const user = (response.value as User).get();

    expect(response.isRight()).toBeTruthy();
    expect(user).toEqual({
      id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      email,
      lastname: 'test',
      name: 'test',
      password: '12345678aB?',
    });
  });
});
