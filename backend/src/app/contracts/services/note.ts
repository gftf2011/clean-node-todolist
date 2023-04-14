import { NoteDTO } from '../../../domain/dto';

export interface NoteService {
  saveNote: (
    title: string,
    description: string,
    userId: string,
  ) => Promise<string>;
  getNote: (id: string) => Promise<NoteDTO>;
}
