import { NoteService } from '../../../../../../src/app/contracts/services';
import { NoteDTO } from '../../../../../../src/domain/dto';

export class NoteServiceDummy implements NoteService {
  saveNote: (
    title: string,
    description: string,
    userId: string,
  ) => Promise<string>;

  getNote: (id: string) => Promise<NoteDTO>;

  getNotesByUserId: (
    userId: string,
    page: number,
    limit: number,
  ) => Promise<NoteDTO[]>;

  updateNote: (note: NoteDTO) => Promise<void>;

  updateFinishedNote: (id: string, finished: boolean) => Promise<void>;

  deleteNote: (id: string) => Promise<boolean>;
}
