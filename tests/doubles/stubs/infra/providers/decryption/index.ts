import { DecryptionProvider } from '../../../../../../src/app/contracts/providers';

type Props = {
  decriptedArray?: string[];
};

export class DecryptionProviderStub implements DecryptionProvider {
  private counter1 = 0;

  constructor(private readonly props?: Props) {}

  public decrypt(_value: string): string {
    const response = this.props.decriptedArray[this.counter1];
    this.counter1++;
    return response;
  }
}
