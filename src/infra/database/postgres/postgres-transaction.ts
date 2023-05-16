import { PoolClient } from 'pg';

import {
  DatabaseConnection,
  DatabaseTransaction,
} from '../../../app/contracts/database';

import { PostgresConnection } from './connection';

type QueryParameters = {
  queryText: string;
  values: any[];
};

export class PostgresTransaction implements DatabaseTransaction {
  private client: PoolClient;

  private connection: DatabaseConnection;

  constructor() {
    this.connection = PostgresConnection.getInstance();
  }

  public async createClient(): Promise<void> {
    this.client = await this.connection.getConnection();
  }

  public async openTransaction(): Promise<void> {
    await this.client.query('BEGIN');
  }

  public async query(input: QueryParameters): Promise<any> {
    return this.client.query(input.queryText, input.values);
  }

  public async closeTransaction(): Promise<void> {
    this.client.release();
  }

  public async commit(): Promise<void> {
    await this.client.query('COMMIT');
  }

  public async rollback(): Promise<void> {
    await this.client.query('ROLLBACK');
  }

  public async close(): Promise<void> {
    await this.connection.disconnect();
  }
}
