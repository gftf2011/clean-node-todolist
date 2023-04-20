import { EncryptionProvider } from '../../../../../../src/app/contracts/providers';

type Props = {
  encriptedArray?: string[];
};

export class EncryptionProviderStub implements EncryptionProvider {
  private counter1 = 0;

  constructor(private readonly props?: Props) {}

  public encrypt(_value: string): string {
    const response = this.props.encriptedArray[this.counter1];
    this.counter1++;
    return response;
  }
}
