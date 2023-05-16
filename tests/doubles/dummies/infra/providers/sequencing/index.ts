import {
  Sequencers,
  SequencingProvider,
} from '../../../../../../src/app/contracts/providers';

export class SequencingProviderDummy implements SequencingProvider {
  generateId: (sequencer: Sequencers) => string;
}
