import { DatabaseQuery } from '../../../../../src/app/contracts/database';

export class DatabaseQueryStub implements DatabaseQuery {
  private counter1 = 0;

  constructor(private readonly responses?: Promise<any>[]) {}

  public async query(_input: any): Promise<any> {
    const response = this.responses[this.counter1];
    this.counter1++;
    return response;
  }
}
