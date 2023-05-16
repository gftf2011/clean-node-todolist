import faker from 'faker';

import '../../../../../src/main/bootstrap';

import { loader } from '../../../../../src/main/loaders';

import { DatabaseTransaction } from '../../../../../src/app/contracts/database';

import { PostgresTransaction } from '../../../../../src/infra/database/postgres';

describe('Postgres Transaction', () => {
  let postgres: DatabaseTransaction;

  beforeAll(async () => {
    await loader();

    postgres = new PostgresTransaction();
  });

  it('should COMMIT transaction', async () => {
    const user = {
      id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    await postgres.createClient();
    await postgres.openTransaction();
    await postgres.query({
      queryText:
        'INSERT INTO users_schema.users(id, name, lastname, email, password) VALUES($1, $2, $3, $4, $5)',
      values: [user.id, user.name, user.lastname, user.email, user.password],
    });
    await postgres.commit();

    const response = (
      await postgres.query({
        queryText: 'SELECT * FROM users_schema.users WHERE id = $1',
        values: [user.id],
      })
    ).rows[0];

    await postgres.closeTransaction();

    expect(response).toStrictEqual(user);
  });

  it('should ROLLBACK transaction', async () => {
    const user = {
      id: `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      email: faker.internet.email().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      password: faker.internet.password(12),
    };

    await postgres.createClient();
    await postgres.openTransaction();
    await postgres.query({
      queryText:
        'INSERT INTO users_schema.users(id, name, lastname, email, password) VALUES($1, $2, $3, $4, $5)',
      values: [user.id, user.name, user.lastname, user.email, user.password],
    });
    await postgres.rollback();

    const response = (
      await postgres.query({
        queryText: 'SELECT * FROM users_schema.users WHERE id = $1',
        values: [user.id],
      })
    ).rows[0];

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
