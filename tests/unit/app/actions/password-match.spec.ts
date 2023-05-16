import { PasswordMatchAction } from '../../../../src/app/actions';

describe('Password Match - Action', () => {
  it('should create action', () => {
    const action = new PasswordMatchAction({
      email: 'email_mock',
      hashedPassword: 'hashed_password_mock',
      password: 'password_mock',
    });

    expect(action.data).toStrictEqual({
      email: 'email_mock',
      hashedPassword: 'hashed_password_mock',
      password: 'password_mock',
    });
    expect(action.operation).toBe('password-match');
  });
});
