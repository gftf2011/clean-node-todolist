import {
  Sequencers,
  SequencingProvider,
} from '../../../../../../src/app/contracts/providers';

type Props = {
  idArray?: string[];
};

export class SequencingProviderStub implements SequencingProvider {
  private counter1 = 0;

  constructor(private readonly props?: Props) {}

  public generateId(sequencer: Sequencers): string {
    const response = this.props.idArray[this.counter1];
    this.counter1++;
    return response;
  }
}
