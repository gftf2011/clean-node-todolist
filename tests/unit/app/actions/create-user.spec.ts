import { CreateUserAction } from '../../../../src/app/actions';

describe('Create User - Action', () => {
  it('should create action', () => {
    const action = new CreateUserAction({
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
      id: 'id_mock',
    });

    expect(action.data).toStrictEqual({
      email: 'email_mock',
      lastname: 'lastname_mock',
      name: 'name_mock',
      password: 'password_mock',
      id: 'id_mock',
    });
    expect(action.operation).toBe('create-user');
  });
});
