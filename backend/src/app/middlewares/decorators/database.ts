import { Middleware } from '../../contracts/middlewares';
import { DatabaseTransaction } from '../../contracts/database';

// It uses the decorator design pattern
export class TransactionMiddlewareDecorator implements Middleware {
  constructor(
    private readonly decoratee: Middleware,
    private readonly database: DatabaseTransaction,
  ) {}

  public async handle(request: any): Promise<any> {
    try {
      await this.database.createClient();
      await this.database.openTransaction();
      const response = await this.decoratee.handle(request);
      await this.database.commit();
      await this.database.closeTransaction();
      return response;
    } catch (err) {
      await this.database.rollback();
      await this.database.closeTransaction();
      throw err;
    }
  }
}
