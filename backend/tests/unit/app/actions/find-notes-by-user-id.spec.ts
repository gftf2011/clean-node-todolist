import { FindNotesByUserIdAction } from '../../../../src/app/actions';

describe('Find Notes By User Id - Action', () => {
  it('should create action', () => {
    const action = new FindNotesByUserIdAction({
      limit: 0,
      page: 0,
      userId: 'user_id_mock',
    });

    expect(action.data).toStrictEqual({
      limit: 0,
      page: 0,
      userId: 'user_id_mock',
    });
    expect(action.operation).toBe('find-notes-by-user-id');
  });
});
