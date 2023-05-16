import { TransactionControllerDecorator } from '../../../../../src/app/controllers/decorators';

import { ControllerStub } from '../../../../doubles/stubs/app/controllers';
import { PostgresTransactionSpy } from '../../../../doubles/spies/infra/database/postgres';

describe('Database Controller - Decorator', () => {
  it('should commit decoratee response', async () => {
    const decoratee = new ControllerStub([Promise.resolve({ is: 'any' })]);
    const database = new PostgresTransactionSpy({
      createClient: {
        responses: [Promise.resolve()],
      },
      openTransaction: {
        responses: [Promise.resolve()],
      },
      commit: {
        responses: [Promise.resolve()],
      },
      closeTransaction: {
        responses: [Promise.resolve()],
      },
    });
    const sut = new TransactionControllerDecorator(decoratee, database);

    const response = await sut.handle({} as any);

    expect(response).toStrictEqual({ is: 'any' });

    expect(database.getProps().createClient.count).toBe(1);
    expect(database.getProps().openTransaction.count).toBe(1);
    expect(database.getProps().commit.count).toBe(1);
    expect(database.getProps().closeTransaction.count).toBe(1);
  });

  it('should rollback and throw error', async () => {
    const decoratee = new ControllerStub([Promise.reject(new Error('error'))]);
    const database = new PostgresTransactionSpy({
      createClient: {
        responses: [Promise.resolve()],
      },
      openTransaction: {
        responses: [Promise.resolve()],
      },
      rollback: {
        responses: [Promise.resolve()],
      },
      closeTransaction: {
        responses: [Promise.resolve()],
      },
    });
    const sut = new TransactionControllerDecorator(decoratee, database);

    const promise = sut.handle({} as any);

    await expect(promise).rejects.toThrowError(new Error('error'));

    expect(database.getProps().createClient.count).toBe(1);
    expect(database.getProps().openTransaction.count).toBe(1);
    expect(database.getProps().rollback.count).toBe(1);
    expect(database.getProps().closeTransaction.count).toBe(1);
  });
});
