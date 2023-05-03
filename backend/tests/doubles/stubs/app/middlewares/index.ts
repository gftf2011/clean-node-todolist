import { Middleware } from '../../../../../src/app/contracts/middlewares';

export class MiddlewareStub implements Middleware {
  private counter1 = 0;

  constructor(private readonly responses?: Promise<any>[]) {}

  public async handle(request: any): Promise<any> {
    const response = this.responses[this.counter1];
    this.counter1++;
    return response;
  }
}
