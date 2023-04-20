import { DeleteNoteAction } from '../../../../src/app/actions';

describe('Delete Note - Action', () => {
  it('should create action', () => {
    const action = new DeleteNoteAction({
      id: 'id_mock',
    });

    expect(action.data).toStrictEqual({
      id: 'id_mock',
    });
    expect(action.operation).toBe('delete-note');
  });
});
