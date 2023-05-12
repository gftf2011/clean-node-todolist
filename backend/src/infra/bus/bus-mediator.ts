/* eslint-disable no-restricted-syntax */
import { Action } from '../../app/contracts/actions';
import { Handler } from '../../app/contracts/handlers';
import { Bus } from '../../app/contracts/bus';
import { ActionNotRegisteredError } from '../../app/errors';

export class BusMediator implements Bus {
  private mapHandlers: Map<string, Handler>;

  constructor(private readonly handlers: Handler[]) {
    this.registerHandlers();
  }

  private registerHandlers(): void {
    this.mapHandlers = new Map<string, Handler>();

    for (const handler of this.handlers) {
      this.mapHandlers.set(handler.operation, handler);
    }
  }

  public async execute(query: Action): Promise<any> {
    const handler = this.mapHandlers.get(query.operation);
    if (!handler) {
      throw new ActionNotRegisteredError(query);
    }

    return handler.handle(query);
  }
}
