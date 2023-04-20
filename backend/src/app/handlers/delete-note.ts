import { Handler } from '../contracts/handlers';
import { NoteRepository } from '../../domain/repositories';
import { DeleteNoteAction } from '../actions';

export class DeleteNoteHandler implements Handler<boolean> {
  readonly operation: string = 'delete-note';

  constructor(private readonly noteRepository: NoteRepository) {}

  public async handle(action: DeleteNoteAction): Promise<boolean> {
    const { id } = action.data;

    const { finished } = await this.noteRepository.find(id);

    if (!finished) return false;

    await this.noteRepository.delete(id);

    return true;
  }
}
