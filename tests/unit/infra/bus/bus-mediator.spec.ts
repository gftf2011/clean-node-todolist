import { FindUserAction, FindNoteAction } from '../../../../src/app/actions';
import { ActionNotRegisteredError } from '../../../../src/app/errors';

import { BusMediator } from '../../../../src/infra/bus';

import { FindUserHandlerSpy } from '../../../doubles/spies/app/handlers';

describe('Bus', () => {
  it('should call handler with correct action', async () => {
    const action = new FindUserAction({ id: 'id_mock' });
    const handler = new FindUserHandlerSpy({ users: [{} as any] });

    const bus = new BusMediator([handler]);
    const response = bus.execute(action);

    await expect(response).resolves.not.toThrowError();
  });

  it('should throw error if action does not match with a handler', async () => {
    const action = new FindNoteAction({ id: 'id_mock' });
    const handler = new FindUserHandlerSpy({ users: [{} as any] });

    const bus = new BusMediator([handler]);
    const response = bus.execute(action);

    await expect(response).rejects.toStrictEqual(
      new ActionNotRegisteredError(action),
    );
  });
});
