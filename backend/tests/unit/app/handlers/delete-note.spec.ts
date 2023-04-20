import { NoteRepository } from '../../../../src/domain/repositories';

import { DeleteNoteHandler } from '../../../../src/app/handlers';
import { DeleteNoteAction } from '../../../../src/app/actions';

import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../src/infra/repositories';

import { NoteRepositoryDummy } from '../../../doubles/dummies/infra/repositories/note';

describe('Delete Note - Handler', () => {
  let noteRepository: NoteRepository;

  beforeAll(() => {
    const factory = new RepositoriesConcreteFactory({} as any).make(
      REPOSITORIES_FACTORIES.LOCAL,
    );
    noteRepository = factory.createNoteRepository();
  });

  it('should return handler operation', () => {
    const noteRepositoryDummy = new NoteRepositoryDummy();

    const handler = new DeleteNoteHandler(noteRepositoryDummy);

    expect(handler.operation).toBe('delete-note');
  });

  it('should return "false" if note is not found', async () => {
    const handler = new DeleteNoteHandler(noteRepository);

    const action = new DeleteNoteAction({
      id: 'id_mock',
    });

    const response = await handler.handle(action);

    expect(response).toBeFalsy();
  });

  it('should return "false" if note is not finished', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    await noteRepository.save({
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: 'description',
      title: 'title',
      userId: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      finished: false,
      id: noteID,
    });
    const handler = new DeleteNoteHandler(noteRepository);

    const action = new DeleteNoteAction({
      id: noteID,
    });

    const response = await handler.handle(action);

    expect(response).toBeFalsy();
  });

  it('should return "true" if note is deleted', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    await noteRepository.save({
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: 'description',
      title: 'title',
      userId: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      finished: true,
      id: noteID,
    });
    const handler = new DeleteNoteHandler(noteRepository);

    const action = new DeleteNoteAction({
      id: noteID,
    });

    const response = await handler.handle(action);

    expect(response).toBeTruthy();
  });

  afterEach(async () => {
    const notes = await noteRepository.findAll(1, 10);
    // eslint-disable-next-line no-restricted-syntax
    for (const note of notes) {
      await noteRepository.delete(note.id);
    }
  });
});
