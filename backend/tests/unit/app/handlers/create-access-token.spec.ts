import { CreateAccessTokenHandler } from '../../../../src/app/handlers';
import { CreateAccessTokenAction } from '../../../../src/app/actions';

import { TokenProviderDummy } from '../../../doubles/dummies/infra/providers/token';
import { TokenProviderStub } from '../../../doubles/stubs/infra/providers/token';

describe('Create Access Token - Handler', () => {
  it('should return handler operation', () => {
    const tokenProvider = new TokenProviderDummy();
    const handler = new CreateAccessTokenHandler(tokenProvider, '');

    expect(handler.operation).toBe('create-access-token');
  });

  it('should handler return access token', async () => {
    const tokenProvider = new TokenProviderStub({
      accessTokenArray: ['token'],
    });
    const handler = new CreateAccessTokenHandler(tokenProvider, '');

    const action = new CreateAccessTokenAction({
      email: 'email_mock',
      id: 'id_mock',
    });

    const response = await handler.handle(action);

    expect(response).toBe('token');
  });
});
