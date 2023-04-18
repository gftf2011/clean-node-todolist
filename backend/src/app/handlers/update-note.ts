import { Handler } from '../contracts/handlers';
import { UpdateNoteAction } from '../actions';
import { EncryptionProvider } from '../contracts/providers';
import { NoteRepository } from '../../domain/repositories';
import { Note } from '../../domain/entity';
import { NoteModel } from '../../domain/models';

export class UpdateNoteHandler implements Handler<void> {
  readonly operation: string = 'update-note';

  constructor(
    private readonly encryption: EncryptionProvider,
    private readonly noteRepository: NoteRepository,
  ) {}

  public async handle(action: UpdateNoteAction): Promise<void> {
    const { description, id, title } = action.data;

    const { createdAt } = await this.noteRepository.find(id);

    const noteOrError = Note.create(id, {
      title,
      description,
      createdAt: new Date(createdAt),
    });

    if (noteOrError.isLeft()) {
      throw noteOrError.value;
    }

    noteOrError.value.updateTime();
    const validatedNote = noteOrError.value.get();

    const encryptedNote: Omit<NoteModel, 'userId'> = {
      ...validatedNote,
      title: this.encryption.encrypt(validatedNote.title),
      description: this.encryption.encrypt(validatedNote.description),
    };

    await this.noteRepository.update(encryptedNote as NoteModel);
  }
}
