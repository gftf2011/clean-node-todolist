import {
  InvalidDescriptionError,
  InvalidTitleError,
} from '../../../../src/domain/errors';
import { NoteRepository } from '../../../../src/domain/repositories';

import { UpdateNoteHandler } from '../../../../src/app/handlers';
import { UpdateNoteAction } from '../../../../src/app/actions';

import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../src/infra/repositories';

import { EncryptionProviderDummy } from '../../../doubles/dummies/infra/providers/encryption';
import { NoteRepositoryDummy } from '../../../doubles/dummies/infra/repositories/note';

import { EncryptionProviderStub } from '../../../doubles/stubs/infra/providers/encryption';

describe('Update Note - Handler', () => {
  let noteRepository: NoteRepository;

  beforeAll(() => {
    const factory = new RepositoriesConcreteFactory({} as any).make(
      REPOSITORIES_FACTORIES.LOCAL,
    );
    noteRepository = factory.createNoteRepository();
  });

  it('should return handler operation', () => {
    const encryptionProvider = new EncryptionProviderDummy();
    const noteRepositoryDummy = new NoteRepositoryDummy();

    const handler = new UpdateNoteHandler(
      encryptionProvider,
      noteRepositoryDummy,
    );

    expect(handler.operation).toBe('update-note');
  });

  it('should throw "InvalidTitleError" if title is invalid', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const encryptionProvider = new EncryptionProviderDummy();
    const handler = new UpdateNoteHandler(encryptionProvider, noteRepository);

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

    const action = new UpdateNoteAction({
      id: noteID,
      description: 'description_mock',
      title: '',
    });

    const promise = handler.handle(action);

    await expect(promise).rejects.toStrictEqual(new InvalidTitleError(''));
  });

  it('should throw "InvalidDescriptionError" if description is invalid', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const encryptionProvider = new EncryptionProviderDummy();
    const handler = new UpdateNoteHandler(encryptionProvider, noteRepository);

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

    const action = new UpdateNoteAction({
      id: noteID,
      description: '',
      title: 'title_mock',
    });

    const promise = handler.handle(action);

    await expect(promise).rejects.toStrictEqual(
      new InvalidDescriptionError(''),
    );
  });

  it('should update note', async () => {
    const noteID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const userID = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

    const encryptionProvider = new EncryptionProviderStub({
      encriptedArray: ['encripted_title_mock', 'encripted_description_mock'],
    });
    const handler = new UpdateNoteHandler(encryptionProvider, noteRepository);

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

    const action = new UpdateNoteAction({
      id: noteID,
      description: 'description_mock',
      title: 'title_mock',
    });

    await handler.handle(action);

    const note = await noteRepository.find(noteID);

    expect(note.id).toBe(noteID);
    expect(note.userId).toBe(userID);
    expect(note.title).toBe('encripted_title_mock');
    expect(note.description).toBe('encripted_description_mock');
    expect(note.finished).toBe(false);
    expect(note.createdAt).toBe(timestamp.toISOString());
    expect(new Date(note.updatedAt).getTime()).toBeGreaterThan(
      timestamp.getTime(),
    );
  });

  afterEach(async () => {
    const notes = await noteRepository.findAll(1, 10);
    // eslint-disable-next-line no-restricted-syntax
    for (const note of notes) {
      await noteRepository.delete(note.id);
    }
  });
});
