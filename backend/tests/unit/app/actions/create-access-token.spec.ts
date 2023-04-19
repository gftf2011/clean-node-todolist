import { CreateAccessTokenAction } from '../../../../src/app/actions';

describe('Create Access Token - Action', () => {
  it('should create action', () => {
    const action = new CreateAccessTokenAction({
      email: 'email_mock',
      id: 'id_mock',
    });

    expect(action.data).toStrictEqual({
      email: 'email_mock',
      id: 'id_mock',
    });
    expect(action.operation).toBe('create-access-token');
  });
});
