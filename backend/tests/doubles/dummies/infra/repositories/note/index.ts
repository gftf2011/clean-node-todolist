import { NoteRepository } from '../../../../../../src/domain/repositories';
import { NoteModel } from '../../../../../../src/domain/models';

export class NoteRepositoryDummy implements NoteRepository {
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

  save: (value: NoteModel) => Promise<void>;

  update: (value: NoteModel) => Promise<void>;

  delete: (id: string) => Promise<void>;

  find: (id: string) => Promise<NoteModel>;

  findAll: (page: number, limit: number) => Promise<NoteModel[]>;
}
