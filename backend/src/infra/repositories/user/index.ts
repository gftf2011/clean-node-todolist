/* eslint-disable max-classes-per-file */
import { UserRepository } from '../../../domain/repositories';
import { UserModel } from '../../../domain/models';

class FakeLocalUserRepositoryProduct implements UserRepository {
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

abstract class UserRepositoryCreator implements UserRepository {
  private product: UserRepository;

  protected abstract factoryMethod(): UserRepository;

  constructor() {
    this.product = this.factoryMethod();
  }

  public async findByEmail(email: string): Promise<UserModel> {
    return this.product.findByEmail(email);
  }

  public async save(value: UserModel): Promise<void> {
    await this.product.save(value);
  }

  public async update(value: UserModel): Promise<void> {
    await this.product.update(value);
  }

  public async delete(id: string): Promise<void> {
    await this.product.delete(id);
  }

  public async find(id: string): Promise<UserModel> {
    return this.product.find(id);
  }

  findAll(page: number, limit: number): Promise<UserModel[]> {
    return this.product.findAll(page, limit);
  }
}

class FakeLocalUserRepositoryCreator extends UserRepositoryCreator {
  protected factoryMethod(): UserRepository {
    return new FakeLocalUserRepositoryProduct();
  }
}

export enum USER_REPOSITORIES_FACTORIES {
  USER_FAKE_LOCAL = 'USER_FAKE_LOCAL',
}

export class UserRepositoryFactory {
  private fakeLocalRepository: FakeLocalUserRepositoryCreator;

  private static instance: UserRepositoryFactory;

  private constructor() {}

  public static initialize(): UserRepositoryFactory {
    if (!this.instance) {
      this.instance = new UserRepositoryFactory();
    }
    return this.instance;
  }

  // eslint-disable-next-line consistent-return
  public make(factoryType: USER_REPOSITORIES_FACTORIES): UserRepository {
    if (factoryType === USER_REPOSITORIES_FACTORIES.USER_FAKE_LOCAL) {
      if (!this.fakeLocalRepository) {
        this.fakeLocalRepository = new FakeLocalUserRepositoryCreator();
      }
      return this.fakeLocalRepository;
    }
  }
}
