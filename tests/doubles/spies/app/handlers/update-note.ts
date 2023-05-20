import { Handler } from '../../../../../src/app/contracts/handlers';
import { UpdateNoteAction } from '../../../../../src/app/actions';

type Info = {
  calls: number;
  data: UpdateNoteAction[];
};

export class UpdateNoteHandlerSpy implements Handler<void> {
  private info: Info = {
    calls: 0,
    data: [],
  };

  operation = 'update-note';

  public getInfo(): Info {
    return this.info;
  }

  public async handle(input: UpdateNoteAction): Promise<void> {
    this.info.data.push(input);
    this.info.calls++;
  }
}
