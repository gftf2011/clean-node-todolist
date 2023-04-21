import { PasswordMatchHandler } from '../../../../src/app/handlers';
import { PasswordMatchAction } from '../../../../src/app/actions';

import { HashProviderDummy } from '../../../doubles/dummies/infra/providers/hash';

import { HashProviderStub } from '../../../doubles/stubs/infra/providers/hash';

describe('Password Match - Handler', () => {
  it('should return handler operation', () => {
    const hashProvider = new HashProviderDummy();

    const handler = new PasswordMatchHandler(hashProvider);

    expect(handler.operation).toBe('password-match');
  });

  it('should return "false" if password does not match', async () => {
    const hashProvider = new HashProviderStub({
      encodingArray: [Promise.resolve('wrong_hashed_password_mock')],
    });

    const action = new PasswordMatchAction({
      email: 'email_mock',
      hashedPassword: 'hashed_password_mock',
      password: 'password_mock',
    });

    const handler = new PasswordMatchHandler(hashProvider);

    const response = await handler.handle(action);

    expect(response).toBeFalsy();
  });

  it('should return "true" if password match', async () => {
    const hashProvider = new HashProviderStub({
      encodingArray: [Promise.resolve('hashed_password_mock')],
    });

    const action = new PasswordMatchAction({
      email: 'email_mock',
      hashedPassword: 'hashed_password_mock',
      password: 'password_mock',
    });

    const handler = new PasswordMatchHandler(hashProvider);

    const response = await handler.handle(action);

    expect(response).toBeTruthy();
  });
});
