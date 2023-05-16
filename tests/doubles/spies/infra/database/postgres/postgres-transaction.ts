import { DatabaseTransaction } from '../../../../../../src/app/contracts/database';

type Props = {
  openTransaction?: {
    count?: number;
    responses: Promise<void>[];
  };
  closeTransaction?: {
    count?: number;
    responses: Promise<void>[];
  };
  createClient?: {
    count?: number;
    responses: Promise<void>[];
  };
  commit?: {
    count?: number;
    responses: Promise<void>[];
  };
  rollback?: {
    count?: number;
    responses: Promise<void>[];
  };
  close?: {
    count?: number;
    responses: Promise<void>[];
  };
  query?: {
    request: any[];
    count?: number;
    responses: Promise<any>[];
  };
};

export class PostgresTransactionSpy implements DatabaseTransaction {
  private counter1 = 0;

  private counter2 = 0;

  private counter3 = 0;

  private counter4 = 0;

  private counter5 = 0;

  private counter6 = 0;

  private counter7 = 0;

  constructor(private readonly props?: Props) {}

  public getProps(): Props {
    return this.props;
  }

  public async openTransaction(): Promise<void> {
    const response = this.props.openTransaction.responses[this.counter1];
    this.counter1++;
    this.props.openTransaction.count = this.counter1;
    return response;
  }

  public async closeTransaction(): Promise<void> {
    const response = this.props.closeTransaction.responses[this.counter2];
    this.counter2++;
    this.props.closeTransaction.count = this.counter2;
    return response;
  }

  public async createClient(): Promise<void> {
    const response = this.props.createClient.responses[this.counter3];
    this.counter3++;
    this.props.createClient.count = this.counter3;
    return response;
  }

  public async commit(): Promise<void> {
    const response = this.props.commit.responses[this.counter4];
    this.counter4++;
    this.props.commit.count = this.counter4;
    return response;
  }

  public async rollback(): Promise<void> {
    const response = this.props.rollback.responses[this.counter5];
    this.counter5++;
    this.props.rollback.count = this.counter5;
    return response;
  }

  public async close(): Promise<void> {
    const response = this.props.close.responses[this.counter6];
    this.counter6++;
    this.props.close.count = this.counter6;
    return response;
  }

  public async query(input: any): Promise<any> {
    this.props.query.request.push(input);
    const response = this.props.query.responses[this.counter7];
    this.counter7++;
    this.props.query.count = this.counter7;
    return response;
  }
}
