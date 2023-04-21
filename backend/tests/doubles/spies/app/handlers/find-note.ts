import { NoteDTO } from '../../../../../src/domain/dto';

import { Handler } from '../../../../../src/app/contracts/handlers';
import { FindNoteAction } from '../../../../../src/app/actions';

type Props = {
  notes?: NoteDTO[];
};

type Info = {
  calls: number;
  data: FindNoteAction[];
};

export class FindNoteHandlerSpy implements Handler<NoteDTO> {
  private counter1 = 0;

  private info: Info = {
    calls: 0,
    data: [],
  };

  operation = 'find-note';

  constructor(private readonly props?: Props) {}

  public getInfo(): Info {
    return this.info;
  }

  public async handle(input: FindNoteAction): Promise<NoteDTO> {
    const response = this.props.notes[this.counter1];
    this.counter1++;

    this.info.data.push(input);
    this.info.calls = this.counter1;

    return response;
  }
}
