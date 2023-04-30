import { PostgresConnection } from '../../infra/database/postgres/connection';

export const loader = async (): Promise<void> => {
  await Promise.all([
    PostgresConnection.getInstance().connect({
      idle_in_transaction_session_timeout: 10000,
      query_timeout: 2500,
      statement_timeout: 2500,
      connectionTimeoutMillis: 2500,
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      idleTimeoutMillis: 10000,
      max: Number(process.env.POSTGRES_MAX),
      password: process.env.POSTGRES_PASSWORD,
      port: Number(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
    }),
  ]);
};
