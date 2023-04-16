import { Pool, PoolClient } from 'pg';

import { DatabaseConnection } from '../../../../app/contracts/database';

type Config = {
  query_timeout: number;
  statement_timeout: number;
  database: string;
  host: string;
  max: number;
  password: string;
  port: number;
  user: string;
  idle_in_transaction_session_timeout: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
};

// It uses the singleton design pattern
export class PostgresConnection implements DatabaseConnection {
  private static pool: Pool;

  private static instance: PostgresConnection;

  private constructor() {}

  static getInstance(): PostgresConnection {
    if (!this.instance) {
      this.instance = new PostgresConnection();
    }
    return this.instance;
  }

  public async connect(config: Config): Promise<void> {
    if (!PostgresConnection.pool) {
      const pool = new Pool({
        query_timeout: config.query_timeout,
        statement_timeout: config.statement_timeout,
        database: config.database,
        host: config.host,
        max: config.max,
        password: config.password,
        port: config.port,
        user: config.user,
        idle_in_transaction_session_timeout:
          config.idle_in_transaction_session_timeout,
        idleTimeoutMillis: config.idleTimeoutMillis,
        connectionTimeoutMillis: config.connectionTimeoutMillis,
      });

      let poolConnection: PoolClient;

      /**
       * Retry connection logic, postgres pool must
       * be tested before clients are created
       */
      while (!poolConnection) {
        try {
          poolConnection = await pool.connect();
        } catch (err) {
          poolConnection = null;
        }
      }

      /**
       * If client is created to check connection it's necessary release the client
       */
      poolConnection.release();

      PostgresConnection.pool = pool;
    }
  }

  public async disconnect(): Promise<void> {
    await PostgresConnection.pool.end();
  }

  public async getConnection(): Promise<PoolClient> {
    return PostgresConnection.pool.connect();
  }
}
