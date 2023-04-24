import { Handler } from '../../../../../src/app/contracts/handlers';
import { VerifyTokenAction } from '../../../../../src/app/actions';

type Props = {
  tokensData?: { id: string; sub: string }[];
};

type Info = {
  calls: number;
  data: VerifyTokenAction[];
};

export class VerifyTokenHandlerSpy
  implements Handler<{ id: string; sub: string }>
{
  private info: Info = {
    calls: 0,
    data: [],
  };

  operation = 'verify-token';

  constructor(private readonly props?: Props) {}

  public getInfo(): Info {
    return this.info;
  }

  public async handle(
    input: VerifyTokenAction,
  ): Promise<{ id: string; sub: string }> {
    const response = this.props.tokensData[this.info.calls];
    this.info.calls++;

    this.info.data.push(input);

    return response;
  }
}
