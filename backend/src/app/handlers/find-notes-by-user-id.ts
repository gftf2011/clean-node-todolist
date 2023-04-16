import { Handler } from '../contracts/handlers';
import { FindNotesByUserIdAction } from '../actions';
import { DecryptionProvider } from '../contracts/providers';
import { NoteRepository } from '../../domain/repositories';
import { NoteDTO } from '../../domain/dto';

export class FindNotesByUserIdHandler implements Handler<NoteDTO[]> {
  readonly operation: string = 'find-notes-by-user-id';

  constructor(
    private readonly decryption: DecryptionProvider,
    private readonly noteRepository: NoteRepository,
  ) {}

  public async handle(action: FindNotesByUserIdAction): Promise<NoteDTO[]> {
    const { userId, page, limit } = action.data;

    const notes = await this.noteRepository.findNotesByUserId(
      userId,
      page,
      limit,
    );

    const decryptedNotes: NoteDTO[] = notes.map(note => ({
      ...note,
      description: this.decryption.decrypt(note.description),
      title: this.decryption.decrypt(note.title),
    }));

    return decryptedNotes;
  }
}
