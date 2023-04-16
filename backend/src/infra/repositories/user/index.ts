/* eslint-disable max-classes-per-file */
import { UserRepository } from '../../../domain/repositories';
import { UserModel } from '../../../domain/models';
import { DatabaseQuery } from '../../../app/contracts/database';

type Rows = {
  rows: UserModel[];
};

class RemoteUserRepositoryProduct implements UserRepository {
  constructor(private readonly query: DatabaseQuery) {}

  async find(id: string): Promise<UserModel> {
    const queryText = 'SELECT * FROM users_schema.users WHERE id = $1';

    const values: any[] = [id];

    const input = {
      queryText,
      values,
    };

    const response = (await this.query.query(input)) as Rows;

    const parsedResponse: UserModel = response.rows[0]
      ? {
          id: response.rows[0].id,
          email: response.rows[0].email,
          lastname: response.rows[0].lastname,
          name: response.rows[0].name,
          password: response.rows[0].password,
        }
      : undefined;
    return parsedResponse;
  }

  async findByEmail(email: string): Promise<UserModel> {
    const queryText = 'SELECT * FROM users_schema.users WHERE email LIKE $1';

    const values: any[] = [email];

    const input = {
      queryText,
      values,
    };

    const response = (await this.query.query(input)) as Rows;

    const parsedResponse: UserModel = response.rows[0]
      ? {
          id: response.rows[0].id,
          email: response.rows[0].email,
          lastname: response.rows[0].lastname,
          name: response.rows[0].name,
          password: response.rows[0].password,
        }
      : undefined;
    return parsedResponse;
  }

  async findAll(page: number, limit: number): Promise<UserModel[]> {
    const queryText =
      'SELECT * FROM users_schema.users ORDER BY id LIMIT $1 OFFSET $2';

    const values: any[] = [limit, limit * page];

    const input = {
      queryText,
      values,
    };

    const response = (await this.query.query(input)) as Rows;

    const parsedResponse: UserModel[] = response.rows[0]
      ? response.rows.map(item => ({
          id: item.id,
          email: item.email,
          lastname: item.lastname,
          name: item.name,
          password: item.password,
        }))
      : [];
    return parsedResponse;
  }

  async save(user: UserModel): Promise<void> {
    const queryText =
      'INSERT INTO users_schema.users(id, name, lastname, email, password) VALUES($1, $2, $3, $4, $5)';

    const values: any[] = [
      user.id,
      user.name,
      user.lastname,
      user.email,
      user.password,
    ];

    const input = {
      queryText,
      values,
    };

    await this.query.query(input);
  }

  async update(user: UserModel): Promise<void> {
    const queryText =
      'UPDATE users_schema.users SET id = $1, name = $2, lastname = $3, email = $4, password = $5 WHERE id = $1';

    const values: any[] = [
      user.id,
      user.name,
      user.lastname,
      user.email,
      user.password,
    ];

    const input = {
      queryText,
      values,
    };

    await this.query.query(input);
  }

  async delete(id: string): Promise<void> {
    const queryText = 'DELETE FROM users_schema.users WHERE id = $1';

    const values: any[] = [id];

    const input = {
      queryText,
      values,
    };

    await this.query.query(input);
  }
}

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

  constructor(protected readonly query?: DatabaseQuery) {
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

  public async findAll(page: number, limit: number): Promise<UserModel[]> {
    return this.product.findAll(page, limit);
  }
}

class FakeLocalUserRepositoryCreator extends UserRepositoryCreator {
  protected factoryMethod(): UserRepository {
    return new FakeLocalUserRepositoryProduct();
  }
}

class RemoteUserRepositoryCreator extends UserRepositoryCreator {
  protected factoryMethod(): UserRepository {
    return new RemoteUserRepositoryProduct(this.query);
  }
}

export enum USER_REPOSITORIES_FACTORIES {
  USER_FAKE_LOCAL = 'USER_FAKE_LOCAL',
  USER_REMOTE = 'USER_REMOTE',
}

export class UserRepositoryFactory {
  private repository: UserRepositoryCreator;

  private static instance: UserRepositoryFactory;

  private constructor(private readonly query: DatabaseQuery) {}

  public static initialize(query: DatabaseQuery): UserRepositoryFactory {
    if (!this.instance) {
      this.instance = new UserRepositoryFactory(query);
    }
    return this.instance;
  }

  // eslint-disable-next-line consistent-return
  public make(factoryType: USER_REPOSITORIES_FACTORIES): UserRepository {
    if (factoryType === USER_REPOSITORIES_FACTORIES.USER_FAKE_LOCAL) {
      this.repository = new FakeLocalUserRepositoryCreator();
    }
    if (factoryType === USER_REPOSITORIES_FACTORIES.USER_REMOTE) {
      this.repository = new RemoteUserRepositoryCreator(this.query);
    }
    return this.repository;
  }
}
