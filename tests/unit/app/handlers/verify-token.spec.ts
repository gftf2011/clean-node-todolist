import { TokenExpiredError } from '../../../../src/app/errors';
import { VerifyTokenHandler } from '../../../../src/app/handlers';
import { VerifyTokenAction } from '../../../../src/app/actions';

import { TokenProviderDummy } from '../../../doubles/dummies/infra/providers/token';
import { TokenProviderStub } from '../../../doubles/stubs/infra/providers/token';

describe('Verify Token - Handler', () => {
  it('should return handler operation', () => {
    const tokenProvider = new TokenProviderDummy();
    const handler = new VerifyTokenHandler(tokenProvider, '');

    expect(handler.operation).toBe('verify-token');
  });

  it('should handler return token data', async () => {
    const tokenProvider = new TokenProviderStub({
      tokenDataArray: [
        {
          data: { id: 'id_mock', sub: 'subject_mock' },
          throwError: false,
        },
      ],
    });
    const handler = new VerifyTokenHandler(tokenProvider, '');

    const action = new VerifyTokenAction({
      token: 'Bearer token_mock',
    });

    const response = await handler.handle(action);

    expect(response).toStrictEqual({ id: 'id_mock', sub: 'subject_mock' });
  });

  it('should throw "ExpiredTokenError" when token expires', async () => {
    const tokenProvider = new TokenProviderStub({
      tokenDataArray: [
        {
          data: null,
          throwError: true,
        },
      ],
    });
    const handler = new VerifyTokenHandler(tokenProvider, '');

    const action = new VerifyTokenAction({
      token: 'Bearer token_mock',
    });

    const promise = handler.handle(action);

    await expect(promise).rejects.toStrictEqual(new TokenExpiredError());
  });
});
