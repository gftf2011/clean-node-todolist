import { NoteRepository } from '../../../../src/domain/repositories';

import { IsNoteFinishedHandler } from '../../../../src/app/handlers';
import { IsNoteFinishedAction } from '../../../../src/app/actions';

import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../src/infra/repositories';

import { NoteRepositoryDummy } from '../../../doubles/dummies/infra/repositories/note';

describe('Is Note Finished - Handler', () => {
  let noteRepository: NoteRepository;

  beforeAll(() => {
    const factory = new RepositoriesConcreteFactory({} as any).make(
      REPOSITORIES_FACTORIES.LOCAL,
    );
    noteRepository = factory.createNoteRepository();
  });

  it('should return handler operation', () => {
    const noteRepositoryDummy = new NoteRepositoryDummy();

    const handler = new IsNoteFinishedHandler(noteRepositoryDummy);

    expect(handler.operation).toBe('is-note-finished');
  });

  it('should change note finishing status', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const month = 0;
    const day = 1;
    const hour = 0;
    const minute = 0;
    const second = 0;
    const millisecond = 0;

    const timestamp = new Date(
      1970,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
    );

    await noteRepository.save({
      createdAt: timestamp.toISOString(),
      updatedAt: timestamp.toISOString(),
      description: 'description',
      title: 'title',
      userId: userID,
      finished: false,
      id: noteID,
    });

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(2020, month, day, hour, minute, second, millisecond),
      );

    const handler = new IsNoteFinishedHandler(noteRepository);

    const action = new IsNoteFinishedAction({
      finished: true,
      id: noteID,
    });

    await handler.handle(action);

    const newTimestamp = new Date(
      2020,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
    );
    const note = await noteRepository.find(noteID);

    expect(note).toStrictEqual({
      createdAt: timestamp.toISOString(),
      updatedAt: newTimestamp.toISOString(),
      description: 'description',
      title: 'title',
      userId: userID,
      finished: true,
      id: noteID,
    });
  });

  afterEach(async () => {
    jest.useRealTimers();

    const notes = await noteRepository.findAll(1, 10);
    // eslint-disable-next-line no-restricted-syntax
    for (const note of notes) {
      await noteRepository.delete(note.id);
    }
  });
});
