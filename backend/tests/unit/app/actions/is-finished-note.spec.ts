import { IsNoteFinishedAction } from '../../../../src/app/actions';

describe('Is Finished Note - Action', () => {
  it('should create action', () => {
    const action = new IsNoteFinishedAction({
      id: 'id_mock',
      finished: false,
    });

    expect(action.data).toStrictEqual({
      id: 'id_mock',
      finished: false,
    });
    expect(action.operation).toBe('is-note-finished');
  });
});
