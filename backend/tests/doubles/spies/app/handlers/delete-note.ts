import { Handler } from '../../../../../src/app/contracts/handlers';
import { DeleteNoteAction } from '../../../../../src/app/actions';

type Props = {
  results?: boolean[];
};

type Info = {
  calls: number;
  data: DeleteNoteAction[];
};

export class DeleteNoteHandlerSpy implements Handler<boolean> {
  private counter1 = 0;

  private info: Info = {
    calls: 0,
    data: [],
  };

  operation = 'delete-note';

  constructor(private readonly props?: Props) {}

  public getInfo(): Info {
    return this.info;
  }

  public async handle(input: DeleteNoteAction): Promise<boolean> {
    const response = this.props.results[this.counter1];
    this.counter1++;

    this.info.data.push(input);
    this.info.calls = this.counter1;

    return response;
  }
}
