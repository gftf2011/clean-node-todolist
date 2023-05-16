import { Sequencers } from '../../../../src/app/contracts/providers';
import { InvalidSequencingDomainError } from '../../../../src/app/errors';

import { SequencingProviderImpl } from '../../../../src/infra/providers';

describe('Sequencing Provider', () => {
  it('should return id for notes', () => {
    const provider = new SequencingProviderImpl();

    const response = provider.generateId(Sequencers.NOTES);

    expect(response.split('-')[2]).toBe('cd4d03827aac478184e5ff210b12b820');
    expect(
      /^([0-9]{17})-([0-9a-f]{32})-([0-9a-f]{32})$/.test(response),
    ).toBeTruthy();
  });

  it('should return id for users', () => {
    const provider = new SequencingProviderImpl();

    const response = provider.generateId(Sequencers.USERS);

    expect(response.split('-')[2]).toBe('337049686209493ea58265e8195bae73');
    expect(
      /^([0-9]{17})-([0-9a-f]{32})-([0-9a-f]{32})$/.test(response),
    ).toBeTruthy();
  });

  it('should return "InvalidSequencingDomainError" error', () => {
    const provider = new SequencingProviderImpl();

    const response = () => {
      provider.generateId('invalid_sequencer' as any);
    };

    expect(response).toThrowError(
      new InvalidSequencingDomainError('invalid_sequencer' as any),
    );
  });
});
