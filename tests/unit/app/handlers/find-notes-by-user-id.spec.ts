import { NoteModel } from '../../../../src/domain/models';
import { NoteRepository } from '../../../../src/domain/repositories';

import { FindNotesByUserIdHandler } from '../../../../src/app/handlers';
import { FindNotesByUserIdAction } from '../../../../src/app/actions';

import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../src/infra/repositories';

import { DecryptionProviderDummy } from '../../../doubles/dummies/infra/providers/decryption';
import { NoteRepositoryDummy } from '../../../doubles/dummies/infra/repositories/note';

import { DecryptionProviderStub } from '../../../doubles/stubs/infra/providers/decryption';

describe('Find Notes By User Id - Handler', () => {
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

    const handler = new FindNotesByUserIdHandler(
      decryptionProvider,
      noteRepositoryDummy,
    );

    expect(handler.operation).toBe('find-notes-by-user-id');
  });

  it('should return empty list with no notes', async () => {
    const decryptionProvider = new DecryptionProviderDummy();

    const handler = new FindNotesByUserIdHandler(
      decryptionProvider,
      noteRepository,
    );

    const action = new FindNotesByUserIdAction({
      limit: 10,
      page: 1,
      userId: 'user_id_mock',
    });

    const response = await handler.handle(action);

    expect(response).toStrictEqual([]);
  });

  it('should return list notes', async () => {
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const notes: NoteModel[] = [];
    const decriptedArray: string[] = [];

    for (let i = 0; i < 10; i++) {
      const description = `decrypted_description${i}`;
      const title = `decrypted_title${i}`;

      const note: NoteModel = {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description,
        title,
        userId: userID,
        finished: false,
        id: i.toString(),
      };

      notes.push(note);
      decriptedArray.push(description);
      decriptedArray.push(title);

      await noteRepository.save(note);
    }

    const decryptionProvider = new DecryptionProviderStub({
      decriptedArray,
    });

    const handler = new FindNotesByUserIdHandler(
      decryptionProvider,
      noteRepository,
    );

    const action = new FindNotesByUserIdAction({
      limit: 10,
      page: 1,
      userId: userID,
    });

    const response = await handler.handle(action);

    expect(response).toStrictEqual(notes);
  });

  afterEach(async () => {
    const notes = await noteRepository.findAll(1, 10);
    // eslint-disable-next-line no-restricted-syntax
    for (const note of notes) {
      await noteRepository.delete(note.id);
    }
  });
});
