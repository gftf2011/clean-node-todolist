import { UserRepository } from '../../../../../../src/domain/repositories';
import { UserModel } from '../../../../../../src/domain/models';

export class UserRepositoryDummy implements UserRepository {
  findByEmail: (email: string) => Promise<UserModel>;

  save: (value: UserModel) => Promise<void>;

  update: (value: UserModel) => Promise<void>;

  delete: (id: string) => Promise<void>;

  find: (id: string) => Promise<UserModel>;

  findAll: (page: number, limit: number) => Promise<UserModel[]>;
}
