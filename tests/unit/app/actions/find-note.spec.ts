import { FindNoteAction } from '../../../../src/app/actions';

describe('Find Note - Action', () => {
  it('should create action', () => {
    const action = new FindNoteAction({
      id: 'id_mock',
    });

    expect(action.data).toStrictEqual({
      id: 'id_mock',
    });
    expect(action.operation).toBe('find-note');
  });
});
