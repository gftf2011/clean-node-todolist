import { NoteDTO } from '../../domain/dto';
import {
  CreateNoteAction,
  DeleteNoteAction,
  FindNoteAction,
  FindNotesByUserIdAction,
  IsNoteFinishedAction,
  UpdateNoteAction,
} from '../actions';
import { Bus } from '../contracts/bus';
import { NoteService } from '../contracts/services';

export class NoteServiceImpl implements NoteService {
  constructor(private readonly bus: Bus) {}

  public async saveNote(
    title: string,
    description: string,
    userId: string,
  ): Promise<string> {
    const action = new CreateNoteAction({ description, title, userId });
    return (await this.bus.execute(action)) as string;
  }

  public async getNote(id: string): Promise<NoteDTO> {
    const action = new FindNoteAction({ id });
    const response = await this.bus.execute(action);
    return response as NoteDTO;
  }

  public async getNotesByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<NoteDTO[]> {
    const action = new FindNotesByUserIdAction({ userId, page, limit });
    const response = await this.bus.execute(action);
    return response as NoteDTO[];
  }

  public async updateNote(note: NoteDTO): Promise<void> {
    const action = new UpdateNoteAction({
      description: note.description,
      id: note.id,
      title: note.title,
    });
    await this.bus.execute(action);
  }

  public async updateFinishedNote(
    id: string,
    finished: boolean,
  ): Promise<void> {
    const action = new IsNoteFinishedAction({
      id,
      finished,
    });
    await this.bus.execute(action);
  }

  public async deleteNote(id: string): Promise<boolean> {
    const action = new DeleteNoteAction({
      id,
    });
    const response = await this.bus.execute(action);
    return response as boolean;
  }
}
