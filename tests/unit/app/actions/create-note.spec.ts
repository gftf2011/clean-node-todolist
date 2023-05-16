import { CreateNoteAction } from '../../../../src/app/actions';

describe('Create Note - Action', () => {
  it('should create action', () => {
    const action = new CreateNoteAction({
      description: 'description_mock',
      title: 'title_mock',
      userId: 'user_id_mock',
    });

    expect(action.data).toStrictEqual({
      description: 'description_mock',
      title: 'title_mock',
      userId: 'user_id_mock',
    });
    expect(action.operation).toBe('create-note');
  });
});
