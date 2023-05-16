import { Handler } from '../contracts/handlers';
import { FindNoteAction } from '../actions';
import { DecryptionProvider } from '../contracts/providers';
import { NoteRepository } from '../../domain/repositories';
import { NoteDTO } from '../../domain/dto';

export class FindNoteHandler implements Handler<NoteDTO> {
  readonly operation: string = 'find-note';

  constructor(
    private readonly decryption: DecryptionProvider,
    private readonly noteRepository: NoteRepository,
  ) {}

  public async handle(action: FindNoteAction): Promise<NoteDTO> {
    const { id } = action.data;

    const note = await this.noteRepository.find(id);

    const decryptedNote: NoteDTO = note
      ? {
          ...note,
          description: this.decryption.decrypt(note.description),
          title: this.decryption.decrypt(note.title),
        }
      : null;

    return decryptedNote;
  }
}
