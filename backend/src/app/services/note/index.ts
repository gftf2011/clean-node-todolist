import { NoteDTO } from '../../../domain/dto';
import { CreateNoteAction, FindNoteAction } from '../../actions';
import { Bus } from '../../contracts/bus';
import { NoteService } from '../../contracts/services';

export class NoteServiceImpl implements NoteService {
  constructor(private readonly bus: Bus) {}

  public async saveNote(
    title: string,
    description: string,
    userId: string,
  ): Promise<void> {
    const action = new CreateNoteAction({ description, title, userId });
    await this.bus.execute(action);
  }

  public async getNote(id: string): Promise<NoteDTO> {
    const action = new FindNoteAction({ id });
    const response = await this.bus.execute(action);
    return response as NoteDTO;
  }
}