import { NoteDTO } from '../../../domain/dto';

type Note = {
  id: string;
  finished: boolean;
  title: string;
  description: string;
  timestamp: string;
};

type PaginatedNotes = {
  notes: Note[];
  previous: boolean;
  next: boolean;
};

export class NotesViewModel {
  private constructor(public readonly paginatedNotes: PaginatedNotes) {}

  public static map(
    notes: NoteDTO[],
    previous: boolean,
    next: boolean,
  ): NotesViewModel {
    return new NotesViewModel({
      notes: notes.map(note => ({
        id: note.id,
        finished: note.finished,
        title: note.title,
        description: note.description,
        timestamp: note.updatedAt,
      })),
      previous,
      next,
    });
  }
}
