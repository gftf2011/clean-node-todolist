import { FindUserAction } from '../../../../src/app/actions';

describe('Find User - Action', () => {
  it('should create action', () => {
    const action = new FindUserAction({
      id: 'id_mock',
    });

    expect(action.data).toStrictEqual({
      id: 'id_mock',
    });
    expect(action.operation).toBe('find-user');
  });
});
