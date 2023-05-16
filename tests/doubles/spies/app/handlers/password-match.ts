import { Handler } from '../../../../../src/app/contracts/handlers';
import { PasswordMatchAction } from '../../../../../src/app/actions';

type Props = {
  results?: boolean[];
};

type Info = {
  calls: number;
  data: PasswordMatchAction[];
};

export class PasswordMatchHandlerSpy implements Handler<boolean> {
  private counter1 = 0;

  private info: Info = {
    calls: 0,
    data: [],
  };

  operation = 'password-match';

  constructor(private readonly props?: Props) {}

  public getInfo(): Info {
    return this.info;
  }

  public async handle(input: PasswordMatchAction): Promise<boolean> {
    const response = this.props.results[this.counter1];
    this.counter1++;

    this.info.data.push(input);
    this.info.calls = this.counter1;

    return response;
  }
}
