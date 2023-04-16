import { Handler } from '../contracts/handlers';
import { CreateNoteAction } from '../actions';
import {
  SequencingProvider,
  Sequencers,
  EncryptionProvider,
} from '../contracts/providers';
import { NoteRepository } from '../../domain/repositories';
import { Note } from '../../domain/entity';
import { NoteModel } from '../../domain/models';

export class CreateNoteHandler implements Handler<void> {
  readonly operation: string = 'create-note';

  constructor(
    private readonly sequencing: SequencingProvider,
    private readonly encryption: EncryptionProvider,
    private readonly noteRepository: NoteRepository,
  ) {}

  public async handle(action: CreateNoteAction): Promise<void> {
    const { description, title, userId } = action.data;
    const id = this.sequencing.generateId(Sequencers.NOTES);

    const noteOrError = Note.create(id, { title, description });

    if (noteOrError.isLeft()) {
      throw noteOrError.value;
    }

    const note = noteOrError.value.get();

    const encryptedNote: NoteModel = {
      ...note,
      title: this.encryption.encrypt(note.title),
      description: this.encryption.encrypt(note.description),
      userId,
    };

    await this.noteRepository.save(encryptedNote);
  }
}
