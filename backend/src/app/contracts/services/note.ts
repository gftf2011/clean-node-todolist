import { NoteModel } from '../../../domain/models';

export interface NoteService {
  saveNote: (
    title: string,
    description: string,
    userId: string,
  ) => Promise<string>;
  getNote: (id: string) => Promise<NoteModel>;
}
