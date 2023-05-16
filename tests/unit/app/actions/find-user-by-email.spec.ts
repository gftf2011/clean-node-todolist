import { FindUserByEmailAction } from '../../../../src/app/actions';

describe('Find User By Email - Action', () => {
  it('should create action', () => {
    const action = new FindUserByEmailAction({
      email: 'email_mock',
    });

    expect(action.data).toStrictEqual({
      email: 'email_mock',
    });
    expect(action.operation).toBe('find-user-by-email');
  });
});
