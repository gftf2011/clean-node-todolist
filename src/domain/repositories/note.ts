import { Repository } from './base';
import { NoteModel } from '../models';

export interface NoteRepository extends Repository<NoteModel> {
  findNotesByUserId: (
    userId: string,
    page: number,
    limit: number,
  ) => Promise<NoteModel[]>;
  updateFinishedNote: (
    id: string,
    finished: boolean,
    updatedAt: string,
  ) => Promise<void>;
}
