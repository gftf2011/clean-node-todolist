// eslint-disable-next-line max-classes-per-file
import { USER_REPOSITORIES_FACTORIES, UserRepositoryFactory } from './user';
import { NOTE_REPOSITORIES_FACTORIES, NoteRepositoryFactory } from './note';
import { NoteRepository, UserRepository } from '../../domain/repositories';
import { DatabaseQuery } from '../../app/contracts/database';

interface AbstractRepositoriesFactory {
  createUserRepository: () => UserRepository;
  createNoteRepository: () => NoteRepository;
}

class ConcreteFakeLocalRepositoriesFactory
  implements AbstractRepositoriesFactory
{
  constructor(private readonly query: DatabaseQuery) {}

  public createUserRepository(): UserRepository {
    return UserRepositoryFactory.initialize(this.query).make(
      USER_REPOSITORIES_FACTORIES.USER_FAKE_LOCAL,
    );
  }

  public createNoteRepository(): NoteRepository {
    return NoteRepositoryFactory.initialize(this.query).make(
      NOTE_REPOSITORIES_FACTORIES.NOTE_FAKE_LOCAL,
    );
  }
}

class ConcreteRemoteRepositoriesFactory implements AbstractRepositoriesFactory {
  constructor(private readonly query: DatabaseQuery) {}

  public createUserRepository(): UserRepository {
    return UserRepositoryFactory.initialize(this.query).make(
      USER_REPOSITORIES_FACTORIES.USER_REMOTE,
    );
  }

  public createNoteRepository(): NoteRepository {
    return NoteRepositoryFactory.initialize(this.query).make(
      NOTE_REPOSITORIES_FACTORIES.NOTE_REMOTE,
    );
  }
}

export enum REPOSITORIES_FACTORIES {
  LOCAL = 'LOCAL',
  REMOTE = 'REMOTE',
}

export class RepositoriesConcreteFactory {
  constructor(private readonly query: DatabaseQuery) {}

  // eslint-disable-next-line consistent-return
  public make(
    factoryType: REPOSITORIES_FACTORIES,
  ): AbstractRepositoriesFactory {
    if (factoryType === REPOSITORIES_FACTORIES.LOCAL) {
      return new ConcreteFakeLocalRepositoriesFactory(this.query);
    }
    if (factoryType === REPOSITORIES_FACTORIES.REMOTE) {
      return new ConcreteRemoteRepositoriesFactory(this.query);
    }
  }
}
