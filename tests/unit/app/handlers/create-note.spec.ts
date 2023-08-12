import {
  InvalidDescriptionError,
  InvalidTitleError,
} from '../../../../src/domain/errors';
import { NoteRepository } from '../../../../src/domain/repositories';

import { CreateNoteHandler } from '../../../../src/app/handlers';
import { CreateNoteAction } from '../../../../src/app/actions';

import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../src/infra/repositories';

import { SequencingProviderDummy } from '../../../doubles/dummies/infra/providers/sequencing';
import { EncryptionProviderDummy } from '../../../doubles/dummies/infra/providers/encryption';
import { NoteRepositoryDummy } from '../../../doubles/dummies/infra/repositories/note';

import { SequencingProviderStub } from '../../../doubles/stubs/infra/providers/sequencing';
import { EncryptionProviderStub } from '../../../doubles/stubs/infra/providers/encryption';

describe('Create Note - Handler', () => {
  let noteRepository: NoteRepository;

  beforeAll(() => {
    const factory = new RepositoriesConcreteFactory({} as any).make(
      REPOSITORIES_FACTORIES.LOCAL,
    );
    noteRepository = factory.createNoteRepository();
  });

  it('should return handler operation', () => {
    const sequencingProvider = new SequencingProviderDummy();
    const encryptionProvider = new EncryptionProviderDummy();
    const noteRepositoryDummy = new NoteRepositoryDummy();

    const handler = new CreateNoteHandler(
      sequencingProvider,
      encryptionProvider,
      noteRepositoryDummy,
    );

    expect(handler.operation).toBe('create-note');
  });

  it('should throw "InvalidTitleError" if title is invalid', async () => {
    const sequencingProvider = new SequencingProviderStub({
      idArray: [`${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`],
    });
    const encryptionProvider = new EncryptionProviderDummy();
    const noteRepositoryDummy = new NoteRepositoryDummy();

    const handler = new CreateNoteHandler(
      sequencingProvider,
      encryptionProvider,
      noteRepositoryDummy,
    );

    const action = new CreateNoteAction({
      description: 'description_mock',
      title: '',
      userId: 'user_id_mock',
    });

    const promise = handler.handle(action);

    await expect(promise).rejects.toStrictEqual(new InvalidTitleError(''));
  });

  it('should throw "InvalidDescriptionError" if title is invalid', async () => {
    const sequencingProvider = new SequencingProviderStub({
      idArray: [`${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`],
    });
    const encryptionProvider = new EncryptionProviderDummy();
    const noteRepositoryDummy = new NoteRepositoryDummy();

    const handler = new CreateNoteHandler(
      sequencingProvider,
      encryptionProvider,
      noteRepositoryDummy,
    );

    const action = new CreateNoteAction({
      description: '',
      title: 'title_mock',
      userId: 'user_id_mock',
    });

    const promise = handler.handle(action);

    await expect(promise).rejects.toStrictEqual(
      new InvalidDescriptionError(''),
    );
  });

  it('should create note', async () => {
    const sequencingProvider = new SequencingProviderStub({
      idArray: [`${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`],
    });
    const encryptionProvider = new EncryptionProviderStub({
      encriptedArray: ['title_encrypted', 'description_encrypted'],
    });

    const handler = new CreateNoteHandler(
      sequencingProvider,
      encryptionProvider,
      noteRepository,
    );

    const action = new CreateNoteAction({
      description: 'description_mock',
      title: 'title_mock',
      userId: 'user_id_mock',
    });

    const response = await handler.handle(action);

    expect(response).toBe(
      '00000000000000000-00000000000000000000000000000000-00000000000000000000000000000000',
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
