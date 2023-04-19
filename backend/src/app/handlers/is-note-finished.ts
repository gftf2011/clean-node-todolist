import { Handler } from '../contracts/handlers';
import { IsNoteFinishedAction } from '../actions';
import { NoteRepository } from '../../domain/repositories';

export class IsNoteFinishedHandler implements Handler<void> {
  readonly operation: string = 'is-note-finished';

  constructor(private readonly noteRepository: NoteRepository) {}

  public async handle(action: IsNoteFinishedAction): Promise<void> {
    const { id, finished } = action.data;

    await this.noteRepository.updateFinishedNote(
      id,
      finished,
      new Date().toISOString(),
    );
  }
}
