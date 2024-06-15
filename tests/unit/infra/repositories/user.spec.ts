import faker from 'faker';

import { UserModel } from '../../../../src/domain/models';
import { UserRepository } from '../../../../src/domain/repositories';

import {
  REPOSITORIES_FACTORIES,
  RepositoriesConcreteFactory,
} from '../../../../src/infra/repositories';

import { PostgresConnectionSpy } from '../../../doubles/spies/infra/database/postgres/connection';

describe('User - Repository', () => {
  describe('Local', () => {
    let repository: UserRepository;

    beforeAll(() => {
      const factory = new RepositoriesConcreteFactory({} as any).make(
        REPOSITORIES_FACTORIES.LOCAL,
      );
      repository = factory.createUserRepository();
    });

    it('should return user if exists', async () => {
      const user: UserModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        email: faker.internet.email().toLowerCase(),
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      };

      await repository.save(user);

      const response = await repository.find(user.id);

      expect(response).toStrictEqual(user);
    });

    it('should NOT return user if do NOT exists', async () => {
      const id = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(31)}1`;
      const user: UserModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        email: faker.internet.email().toLowerCase(),
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      };

      await repository.save(user);

      const response = await repository.find(id);

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

      await repository.save(user);

      const response = await repository.findByEmail(user.email);

      expect(response).toStrictEqual(user);
    });

    it('should NOT return user by email if do NOT exists', async () => {
      const email = 'test@mail.com';
      const user: UserModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        email: 'test2@mail.com',
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      };

      await repository.save(user);

      const response = await repository.findByEmail(email);

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
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const user of users) {
        await repository.save(user);
      }

      const response = await repository.findAll(1, 2);

      expect(response).toStrictEqual(users);
    });

    it('should return updated user', async () => {
      const user: UserModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        email: 'test@mail.com',
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      };

      await repository.save(user);
      await repository.update({ ...user, email: 'test2@mail.com' });

      const response = await repository.find(user.id);

      expect(response).toStrictEqual({ ...user, email: 'test2@mail.com' });
    });

    it('should delete user', async () => {
      const user: UserModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        email: 'test@mail.com',
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      };

      await repository.save(user);
      await repository.delete(user.id);

      const response = await repository.find(user.id);

      expect(response).toBeUndefined();
    });

    afterEach(async () => {
      const users = await repository.findAll(1, 10);
      // eslint-disable-next-line no-restricted-syntax
      for (const user of users) {
        await repository.delete(user.id);
      }
    });
  });

  describe('Remote', () => {
    it('should return user if exists', async () => {
      const user: UserModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        email: faker.internet.email().toLowerCase(),
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      };

      const spy = new PostgresConnectionSpy([
        Promise.resolve({ rows: [user] }),
      ]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createUserRepository();

      const response = await repository.find(user.id);

      expect(response).toStrictEqual(user);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'SELECT * FROM users_schema.users WHERE id = $1',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([user.id]);
    });

    it('should NOT return user if do NOT exists', async () => {
      const user: UserModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        email: faker.internet.email().toLowerCase(),
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      };

      const spy = new PostgresConnectionSpy([Promise.resolve({ rows: [] })]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createUserRepository();

      const response = await repository.find(user.id);

      expect(response).toBeUndefined();

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'SELECT * FROM users_schema.users WHERE id = $1',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([user.id]);
    });

    it('should return user by email if exists', async () => {
      const user: UserModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        email: faker.internet.email().toLowerCase(),
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      };

      const spy = new PostgresConnectionSpy([
        Promise.resolve({ rows: [user] }),
      ]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createUserRepository();

      const response = await repository.findByEmail(user.email);

      expect(response).toStrictEqual(user);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'SELECT * FROM users_schema.users WHERE email = $1',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([user.email]);
    });

    it('should NOT return user by email if do NOT exists', async () => {
      const user: UserModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        email: faker.internet.email().toLowerCase(),
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      };

      const spy = new PostgresConnectionSpy([Promise.resolve({ rows: [] })]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createUserRepository();

      const response = await repository.findByEmail(user.email);

      expect(response).toBeUndefined();

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'SELECT * FROM users_schema.users WHERE email = $1',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([user.email]);
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
      ];

      const spy = new PostgresConnectionSpy([Promise.resolve({ rows: users })]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createUserRepository();

      const limit = 2;
      const page = 1;
      const response = await repository.findAll(page, limit);

      expect(response).toStrictEqual(users);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'SELECT * FROM users_schema.users ORDER BY id LIMIT $1 OFFSET $2',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([
        limit,
        limit * page,
      ]);
    });

    it('should return empty array if no users were found', async () => {
      const spy = new PostgresConnectionSpy([Promise.resolve({ rows: [] })]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createUserRepository();

      const limit = 2;
      const page = 1;
      const response = await repository.findAll(page, limit);

      expect(response).toStrictEqual([]);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'SELECT * FROM users_schema.users ORDER BY id LIMIT $1 OFFSET $2',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([
        limit,
        limit * page,
      ]);
    });

    it('should save user', async () => {
      const user: UserModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        email: faker.internet.email().toLowerCase(),
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      };

      const spy = new PostgresConnectionSpy([Promise.resolve()]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createUserRepository();

      await repository.save(user);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'INSERT INTO users_schema.users(id, name, lastname, email, password) VALUES($1, $2, $3, $4, $5)',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([
        user.id,
        user.name,
        user.lastname,
        user.email,
        user.password,
      ]);
    });

    it('should return updated user', async () => {
      const user: UserModel = {
        id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
        email: faker.internet.email().toLowerCase(),
        name: faker.name.firstName().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        password: faker.internet.password(12),
      };

      const spy = new PostgresConnectionSpy([Promise.resolve()]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createUserRepository();

      await repository.update(user);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'UPDATE users_schema.users SET id = $1, name = $2, lastname = $3, email = $4, password = $5 WHERE id = $1',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([
        user.id,
        user.name,
        user.lastname,
        user.email,
        user.password,
      ]);
    });

    it('should delete user', async () => {
      const userId = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;

      const spy = new PostgresConnectionSpy([Promise.resolve()]);

      const factory = new RepositoriesConcreteFactory(spy).make(
        REPOSITORIES_FACTORIES.REMOTE,
      );
      const repository = factory.createUserRepository();

      await repository.delete(userId);

      expect(spy.getQueryInputs()[0].queryText).toBe(
        'DELETE FROM users_schema.users WHERE id = $1',
      );
      expect(spy.getQueryInputs()[0].values).toStrictEqual([userId]);
    });
  });
});
