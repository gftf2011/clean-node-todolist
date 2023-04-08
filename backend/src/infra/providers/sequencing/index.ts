import { v4, v5 } from 'uuid';
import {
  SequencingProvider,
  Sequencers,
} from '../../../app/contracts/providers';
import { InvalidSequencingDomainError } from '../../../app/errors';

const USERS = '33704968-6209-493e-a582-65e8195bae73';
const NOTES = 'cd4d0382-7aac-4781-84e5-ff210b12b820';

export class SequencingProviderImpl implements SequencingProvider {
  private generateSequencingDomainIdentifier(sequencer: Sequencers): string {
    if (sequencer === Sequencers.USERS) {
      return USERS.replace(/(-)/gm, '');
    }
    if (sequencer === Sequencers.NOTES) {
      return NOTES.replace(/(-)/gm, '');
    }
    throw new InvalidSequencingDomainError(sequencer);
  }

  private generateSequencingRandomIdentifier(): string {
    return v4().replace(/(-)/gm, '');
  }

  private generateSequencingTimestamp(): string {
    const date = new Date();
    return `${date.getFullYear().toString()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date
      .getHours()
      .toString()
      .padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date
      .getSeconds()
      .toString()
      .padStart(2, '0')}${date.getMilliseconds().toString().padStart(3, '0')}`;
  }

  public generateId(sequencer: Sequencers): string {
    const part1 = this.generateSequencingTimestamp();
    const part2 = this.generateSequencingRandomIdentifier();
    const part3 = this.generateSequencingDomainIdentifier(sequencer);

    return `${part1}-${part2}-${part3}`;
  }
}
