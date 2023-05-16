import { NoteService } from '../../../../../../src/app/contracts/services';
import { NoteDTO } from '../../../../../../src/domain/dto';

type Props = {
  saveNote?: Promise<void>[];
  getNote?: Promise<NoteDTO>[];
  getNotesByUserId?: Promise<NoteDTO[]>[];
  updateNote?: Promise<void>[];
  updateFinishedNote?: Promise<void>[];
  deleteNote?: Promise<boolean>[];
};

export class NoteServiceStub implements NoteService {
  private counter1 = 0;

  private counter2 = 0;

  private counter3 = 0;

  private counter4 = 0;

  private counter5 = 0;

  private counter6 = 0;

  constructor(private readonly props?: Props) {}

  public async saveNote(
    _title: string,
    _description: string,
    _userId: string,
  ): Promise<void> {
    const response = this.props.saveNote[this.counter1];
    this.counter1++;
    return response;
  }

  public async getNote(_id: string): Promise<NoteDTO> {
    const response = this.props.getNote[this.counter2];
    this.counter2++;
    return response;
  }

  public async getNotesByUserId(
    _userId: string,
    _page: number,
    _limit: number,
  ): Promise<NoteDTO[]> {
    const response = this.props.getNotesByUserId[this.counter3];
    this.counter3++;
    return response;
  }

  public async updateNote(_note: NoteDTO): Promise<void> {
    const response = this.props.updateNote[this.counter4];
    this.counter4++;
    return response;
  }

  public async updateFinishedNote(
    _id: string,
    _finished: boolean,
  ): Promise<void> {
    const response = this.props.updateFinishedNote[this.counter5];
    this.counter5++;
    return response;
  }

  public async deleteNote(_id: string): Promise<boolean> {
    const response = this.props.deleteNote[this.counter6];
    this.counter6++;
    return response;
  }
}
