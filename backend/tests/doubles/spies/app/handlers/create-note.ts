import { Handler } from '../../../../../src/app/contracts/handlers';
import { CreateNoteAction } from '../../../../../src/app/actions';

type Info = {
  calls: number;
  data: CreateNoteAction[];
};

export class CreateNoteHandlerSpy implements Handler<void> {
  private info: Info = {
    calls: 0,
    data: [],
  };

  operation = 'create-note';

  public getInfo(): Info {
    return this.info;
  }

  public async handle(input: CreateNoteAction): Promise<void> {
    this.info.data.push(input);
    this.info.calls++;
  }
}
