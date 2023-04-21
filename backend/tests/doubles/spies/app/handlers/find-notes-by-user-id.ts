import { NoteDTO } from '../../../../../src/domain/dto';

import { Handler } from '../../../../../src/app/contracts/handlers';
import { FindNotesByUserIdAction } from '../../../../../src/app/actions';

type Props = {
  notesArray?: NoteDTO[][];
};

type Info = {
  calls: number;
  data: FindNotesByUserIdAction[];
};

export class FindNotesByUserIdHandlerSpy implements Handler<NoteDTO[]> {
  private counter1 = 0;

  private info: Info = {
    calls: 0,
    data: [],
  };

  operation = 'find-notes-by-user-id';

  constructor(private readonly props?: Props) {}

  public getInfo(): Info {
    return this.info;
  }

  public async handle(input: FindNotesByUserIdAction): Promise<NoteDTO[]> {
    const response = this.props.notesArray[this.counter1];
    this.counter1++;

    this.info.data.push(input);
    this.info.calls = this.counter1;

    return response;
  }
}
