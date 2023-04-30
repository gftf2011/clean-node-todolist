import { PostgresConnection } from '../../../../../../src/infra/database/postgres/connection';

describe('Postgres - Database Connection', () => {
  it('should open and close database connection', async () => {
    const pool = PostgresConnection.getInstance();
    await pool.connect({
      idle_in_transaction_session_timeout: 1000,
      query_timeout: 1000,
      statement_timeout: 1000,
      connectionTimeoutMillis: 1000,
      database: 'postgres_db',
      host: '0.0.0.0',
      idleTimeoutMillis: 1,
      max: 1,
      password: 'ab23cff0679d',
      port: 5432,
      user: 'executor',
    });
    await pool.disconnect();
  });
});
