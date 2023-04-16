import { NoteDTO } from '../../../domain/dto';

export class NoteViewModel {
  private constructor(
    public readonly id: string,
    public readonly finished: boolean,
    public readonly title: string,
    public readonly description: string,
    public readonly timestamp: string,
  ) {}

  public static map(note: NoteDTO): NoteViewModel {
    return new NoteViewModel(
      note.id,
      note.finished,
      note.title,
      note.description,
      note.updatedAt,
    );
  }
}
