export enum Sequencers {
  USERS = 'USERS',
  NOTES = 'NOTES',
}

export interface SequencingProvider {
  generateId: (sequencer: Sequencers) => string;
}
