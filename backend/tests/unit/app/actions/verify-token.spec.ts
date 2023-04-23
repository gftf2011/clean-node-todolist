import { VerifyTokenAction } from '../../../../src/app/actions';

describe('Verify Token - Action', () => {
  it('should create action', () => {
    const action = new VerifyTokenAction({
      token: 'token_mock',
    });

    expect(action.data).toStrictEqual({
      token: 'token_mock',
    });
    expect(action.operation).toBe('verify-token');
  });
});
