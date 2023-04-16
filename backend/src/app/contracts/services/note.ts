import { NoteDTO } from '../../../domain/dto';

export interface NoteService {
  saveNote: (
    title: string,
    description: string,
    userId: string,
  ) => Promise<void>;
  getNote: (id: string) => Promise<NoteDTO>;
  getNotesByUserId: (
    userId: string,
    page: number,
    limit: number,
  ) => Promise<NoteDTO[]>;
}
