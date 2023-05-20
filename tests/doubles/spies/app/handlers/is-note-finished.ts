import { Handler } from '../../../../../src/app/contracts/handlers';
import { IsNoteFinishedAction } from '../../../../../src/app/actions';

type Info = {
  calls: number;
  data: IsNoteFinishedAction[];
};

export class IsNoteFinishedHandlerSpy implements Handler<void> {
  private info: Info = {
    calls: 0,
    data: [],
  };

  operation = 'is-note-finished';

  public getInfo(): Info {
    return this.info;
  }

  public async handle(input: IsNoteFinishedAction): Promise<void> {
    this.info.data.push(input);
    this.info.calls++;
  }
}
