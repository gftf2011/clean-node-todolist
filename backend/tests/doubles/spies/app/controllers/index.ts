import { Controller } from '../../../../../src/app/contracts/controllers';

export class ControllerSpy implements Controller {
  private counter1 = 0;

  constructor(private readonly responses?: Promise<any>[]) {}

  public async handle(request: any): Promise<any> {
    const response = this.responses[this.counter1];
    this.counter1++;
    return response;
  }
}
