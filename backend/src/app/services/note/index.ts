import { NoteModel } from '../../../domain/models';
import { CreateNoteAction, FindNoteAction } from '../../actions';
import { Bus } from '../../contracts/bus';
import { NoteService } from '../../contracts/services';

export class NoteServiceImpl implements NoteService {
  constructor(private readonly bus: Bus) {}

  public async saveNote(
    title: string,
    description: string,
    userId: string,
  ): Promise<string> {
    const action = new CreateNoteAction({ description, title, userId });
    const response = await this.bus.execute(action);
    return response as string;
  }

  public async getNote(id: string): Promise<NoteModel> {
    const action = new FindNoteAction({ id });
    const response = await this.bus.execute(action);
    return response as NoteModel;
  }
}
