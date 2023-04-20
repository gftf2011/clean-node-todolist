import {
  TokenPayload,
  TokenProvider,
} from '../../../../../../src/app/contracts/providers';

type Props = {
  accessTokenArray?: string[];
  tokenDataArray?: any[];
};

export class TokenProviderStub implements TokenProvider {
  private counter1 = 0;

  private counter2 = 0;

  constructor(private readonly props?: Props) {}

  public sign(_data: TokenPayload): string {
    const response = this.props.accessTokenArray[this.counter1];
    this.counter1++;
    return response;
  }

  public verify(_token: string, _secret: string): any {
    const response = this.props.tokenDataArray[this.counter2];
    this.counter2++;
    return response;
  }
}
