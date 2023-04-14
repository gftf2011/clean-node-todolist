import { NoteDTO } from '../../../domain/dto';

export class CreatedNoteViewModel {
  private constructor(
    public readonly id: string,
    public readonly finished: boolean,
    public readonly title: string,
    public readonly description: string,
    public readonly timestamp: string,
  ) {}

  public static map(note: NoteDTO): CreatedNoteViewModel {
    return new CreatedNoteViewModel(
      note.id,
      note.finished,
      note.title,
      note.title,
      note.updatedAt,
    );
  }
}
