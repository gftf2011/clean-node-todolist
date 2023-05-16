import { HashProvider } from '../../../../../../src/app/contracts/providers';

type Props = {
  encodingArray?: Promise<string>[];
};

export class HashProviderStub implements HashProvider {
  private counter1 = 0;

  constructor(private readonly props?: Props) {}

  public async encode(_value: string, _salt?: string): Promise<string> {
    const response = this.props.encodingArray[this.counter1];
    this.counter1++;
    return response;
  }
}
