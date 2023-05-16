import { Handler } from '../../../../../src/app/contracts/handlers';
import { CreateAccessTokenAction } from '../../../../../src/app/actions';

type Props = {
  tokens?: string[];
};

type Info = {
  calls: number;
  data: CreateAccessTokenAction[];
};

export class CreateAccessTokenHandlerSpy implements Handler<string> {
  private counter1 = 0;

  private info: Info = {
    calls: 0,
    data: [],
  };

  operation = 'create-access-token';

  constructor(private readonly props?: Props) {}

  public getInfo(): Info {
    return this.info;
  }

  public async handle(input: CreateAccessTokenAction): Promise<string> {
    const response = this.props.tokens[this.counter1];
    this.counter1++;

    this.info.data.push(input);
    this.info.calls = this.counter1;

    return response;
  }
}
