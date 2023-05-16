import '../../../../src/main/bootstrap';

import faker from 'faker';

import { loader } from '../../../../src/main/loaders';

import { UserModel } from '../../../../src/domain/models';

import { DatabaseTransaction } from '../../../../src/app/contracts/database';

import { PostgresTransaction } from '../../../../src/infra/database/postgres';
import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../src/infra/repositories';

describe('User - Repository', () => {
  let postgres: DatabaseTransaction;

  beforeAll(async () => {
    await loader();

    postgres = new PostgresTransaction();
  });

  it('should return user if exists', async () => {
    const user: UserModel = {
      id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const repository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    await repository.save(user);

    const response = await repository.find(user.id);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toStrictEqual(user);
  });

  it('should NOT return user if do NOT exists', async () => {
    const user: UserModel = {
      id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const repository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    const response = await repository.find(user.id);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toBeUndefined();
  });

  it('should return user by email if exists', async () => {
    const user: UserModel = {
      id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const repository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    await repository.save(user);

    const response = await repository.findByEmail(user.email);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toStrictEqual(user);
  });

  it('should NOT return user by email if do NOT exists', async () => {
    const user: UserModel = {
      id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const repository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    const response = await repository.findByEmail(user.email);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toBeUndefined();
  });

  it('should return all users from pagination', async () => {
    const users: UserModel[] = [
      {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        email: 'test@mail.com',
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      },
      {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(31)}1`,
        email: 'test2@mail.com',
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      },
      {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(31)}2`,
        email: 'test3@mail.com',
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      },
    ];

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const repository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    // eslint-disable-next-line no-restricted-syntax
    for (const user of users) {
      await repository.save(user);
    }

    const limit = users.length;
    const page = 0;
    const response = await repository.findAll(page, limit);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toStrictEqual(users);
  });

  it('should return empty array users from pagination', async () => {
    const users: UserModel[] = [
      {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        email: 'test@mail.com',
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      },
      {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(31)}1`,
        email: 'test2@mail.com',
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      },
      {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(31)}2`,
        email: 'test3@mail.com',
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      },
    ];

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const repository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    // eslint-disable-next-line no-restricted-syntax
    for (const user of users) {
      await repository.save(user);
    }

    const limit = users.length;
    const page = 1;
    const response = await repository.findAll(page, limit);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toStrictEqual([]);
  });

  it('should return updated user', async () => {
    const user: UserModel = {
      id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const repository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    const email = 'test@mail.com';

    await repository.save(user);
    await repository.update({ ...user, email });
    const response = await repository.find(user.id);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toStrictEqual({ ...user, email });
  });

  it('should delete user', async () => {
    const user: UserModel = {
      id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    const factory = new RepositoriesConcreteFactory(postgres).make(
      REPOSITORIES_FACTORIES.REMOTE,
    );
    const repository = factory.createUserRepository();

    await postgres.createClient();
    await postgres.openTransaction();

    await repository.save(user);
    await repository.delete(user.id);
    const response = await repository.find(user.id);

    await postgres.commit();
    await postgres.closeTransaction();

    expect(response).toBeUndefined();
  });

  afterEach(async () => {
    await postgres.createClient();
    await postgres.openTransaction();
    await postgres.query({
      queryText: 'DELETE FROM users_schema.users',
      values: [],
    });
    await postgres.commit();
    await postgres.closeTransaction();
  });

  afterAll(async () => {
    await postgres.close();
  });
});
