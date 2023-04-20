import { NoteRepository } from '../../../../src/domain/repositories';

import { FindNoteHandler } from '../../../../src/app/handlers';
import { FindNoteAction } from '../../../../src/app/actions';

import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../src/infra/repositories';

import { DecryptionProviderDummy } from '../../../doubles/dummies/infra/providers/decryption';
import { NoteRepositoryDummy } from '../../../doubles/dummies/infra/repositories/note';

import { DecryptionProviderStub } from '../../../doubles/stubs/infra/providers/decryption';

describe('Find Note - Handler', () => {
  let noteRepository: NoteRepository;

  beforeAll(() => {
    const factory = new RepositoriesConcreteFactory({} as any).make(
      REPOSITORIES_FACTORIES.LOCAL,
    );
    noteRepository = factory.createNoteRepository();
  });

  it('should return handler operation', () => {
    const decryptionProvider = new DecryptionProviderDummy();
    const noteRepositoryDummy = new NoteRepositoryDummy();

    const handler = new FindNoteHandler(
      decryptionProvider,
      noteRepositoryDummy,
    );

    expect(handler.operation).toBe('find-note');
  });

  it('should return "null" if no note is found', async () => {
    const decryptionProvider = new DecryptionProviderDummy();

    const handler = new FindNoteHandler(decryptionProvider, noteRepository);

    const action = new FindNoteAction({
      id: 'id_mock',
    });

    const response = await handler.handle(action);

    expect(response).toBeNull();
  });

  it('should return note', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const timestamp = new Date();

    await noteRepository.save({
      createdAt: timestamp.toISOString(),
      updatedAt: timestamp.toISOString(),
      description: 'description',
      title: 'title',
      userId: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      finished: false,
      id: noteID,
    });

    const decryptionProvider = new DecryptionProviderStub({
      decriptedArray: ['decrypted_description', 'decrypted_title'],
    });
    const handler = new FindNoteHandler(decryptionProvider, noteRepository);
    const action = new FindNoteAction({
      id: noteID,
    });
    const response = await handler.handle(action);
    expect(response).toStrictEqual({
      createdAt: timestamp.toISOString(),
      updatedAt: timestamp.toISOString(),
      description: 'decrypted_description',
      title: 'decrypted_title',
      userId: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      finished: false,
      id: noteID,
    });
  });

  afterEach(async () => {
    const notes = await noteRepository.findAll(1, 10);
    // eslint-disable-next-line no-restricted-syntax
    for (const note of notes) {
      await noteRepository.delete(note.id);
    }
  });
});
