import { Handler } from '../../../../../src/app/contracts/handlers';
import { CreateUserAction } from '../../../../../src/app/actions';

type Info = {
  calls: number;
  data: CreateUserAction[];
};

export class CreateUserHandlerSpy implements Handler<void> {
  private info: Info = {
    calls: 0,
    data: [],
  };

  operation = 'create-user';

  public getInfo(): Info {
    return this.info;
  }

  public async handle(input: CreateUserAction): Promise<void> {
    this.info.data.push(input);
    this.info.calls++;
  }
}
