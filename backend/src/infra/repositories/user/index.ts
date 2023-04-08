/* eslint-disable max-classes-per-file */
import { UserRepository } from '../../../domain/repositories';
import { UserModel } from '../../../domain/models';

type UserRepositoryAbstractProduct = UserRepository;

class FakeLocalUserRepositoryProduct implements UserRepositoryAbstractProduct {
  private users: UserModel[] = [];

  async find(id: string): Promise<UserModel> {
    return this.users.find(user => user.id === id);
  }

  async findByEmail(email: string): Promise<UserModel> {
    return this.users.find(user => user.email === email);
  }

  async findAll(page: number, limit: number): Promise<UserModel[]> {
    return this.users.slice((page - 1) * limit, page * limit);
  }

  async save(user: UserModel): Promise<void> {
    this.users.push(user);
  }

  async update(userUpdated: UserModel): Promise<void> {
    this.users.forEach((user: UserModel, index: number, array: UserModel[]) => {
      if (user.id === userUpdated.id) {
        // eslint-disable-next-line no-param-reassign
        array[index] = userUpdated;
      }
    });
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(user => user.id === id);
  }
}

interface UserRepositoryAbstractFactory {
  createRepository: () => UserRepositoryAbstractProduct;
}

export class LocalUserRepositoryFactory
  implements UserRepositoryAbstractFactory
{
  public createRepository(): UserRepositoryAbstractProduct {
    return new FakeLocalUserRepositoryProduct();
  }
}
