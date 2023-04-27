import { TokenProviderImpl } from '../../../../src/infra/providers';

const sleep = (timeout: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

describe('Token Provider', () => {
  it('should return token', () => {
    const time = 1000 * 60;
    const provider = new TokenProviderImpl(time);

    const response = provider.sign({
      payload: { id: 'id_mock' },
      secret: 'secret_mock',
      subject: 'subject_mock',
    });

    expect(response).toBeDefined();
  });

  it('should return data from verified token', () => {
    const time = 60; // seconds
    const provider = new TokenProviderImpl(time);

    const secret = 'Start wide, expand further, and never look back';

    const token = provider.sign({
      payload: { id: 'id_mock' },
      secret,
      subject: 'subject_mock',
    });

    const data = provider.verify(token, secret);

    expect(data.id).toBe('id_mock');
    expect(data.sub).toBe('subject_mock');
  });

  it('should throw error if token expires', async () => {
    const time = 5; // seconds
    const provider = new TokenProviderImpl(time);

    const secret = 'Start wide, expand further, and never look back';

    const token = provider.sign({
      payload: { id: 'id_mock' },
      secret,
      subject: 'subject_mock',
    });

    await sleep(time * 1000);

    const response = () => {
      provider.verify(token, secret);
    };

    expect(response).toThrow();
  });
});
