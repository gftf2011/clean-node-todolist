// eslint-disable-next-line max-classes-per-file
import { USER_REPOSITORIES_FACTORIES, UserRepositoryFactory } from './user';
import { NOTE_REPOSITORIES_FACTORIES, NoteRepositoryFactory } from './note';
import { NoteRepository, UserRepository } from '../../domain/repositories';

interface AbstractRepositoriesFactory {
  createUserRepository: () => UserRepository;
  createNoteRepository: () => NoteRepository;
}

class ConcreteFakeLocalRepositoriesFactory
  implements AbstractRepositoriesFactory
{
  public createUserRepository(): UserRepository {
    return UserRepositoryFactory.initialize().make(
      USER_REPOSITORIES_FACTORIES.USER_FAKE_LOCAL,
    );
  }

  public createNoteRepository(): NoteRepository {
    return NoteRepositoryFactory.initialize().make(
      NOTE_REPOSITORIES_FACTORIES.NOTE_FAKE_LOCAL,
    );
  }
}

export enum REPOSITORIES_FACTORIES {
  LOCAL = 'LOCAL',
}

export class RepositoriesConcreteFactory {
  constructor() {}

  // eslint-disable-next-line consistent-return
  public make(
    factoryType: REPOSITORIES_FACTORIES,
  ): AbstractRepositoriesFactory {
    if (factoryType === REPOSITORIES_FACTORIES.LOCAL) {
      return new ConcreteFakeLocalRepositoriesFactory();
    }
  }
}
