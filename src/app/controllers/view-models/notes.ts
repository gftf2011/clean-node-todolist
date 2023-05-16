import { NoteDTO } from '../../../domain/dto';

type Note = {
  id: string;
  finished: boolean;
  title: string;
  description: string;
  timestamp: string;
};

export class NotesViewModel {
  private constructor(public readonly notes: Note[]) {}

  public static map(notes: NoteDTO[]): NotesViewModel {
    return new NotesViewModel(
      notes.map(note => ({
        id: note.id,
        finished: note.finished,
        title: note.title,
        description: note.description,
        timestamp: note.updatedAt,
      })),
    );
  }
}
