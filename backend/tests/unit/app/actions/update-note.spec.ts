import { UpdateNoteAction } from '../../../../src/app/actions';

describe('Update Note - Action', () => {
  it('should create action', () => {
    const action = new UpdateNoteAction({
      description: 'description_mock',
      id: 'id_mock',
      title: 'title_mock',
    });

    expect(action.data).toStrictEqual({
      description: 'description_mock',
      id: 'id_mock',
      title: 'title_mock',
    });
    expect(action.operation).toBe('update-note');
  });
});
