import { DatabaseQuery } from '../../../../../../src/app/contracts/database';

export class PostgresConnectionSpy implements DatabaseQuery {
  private counter1 = 0;

  private queryInputs: any[] = [];

  constructor(private readonly responses?: Promise<any>[]) {}

  public getQueryInputs(): any[] {
    return this.queryInputs;
  }

  public async query(input: any): Promise<any> {
    this.queryInputs.push(input);
    const response = this.responses[this.counter1];
    this.counter1++;
    return response;
  }
}
