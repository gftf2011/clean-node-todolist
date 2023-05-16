import {
  badRequest,
  forbidden,
  ok,
  serverError,
  serviceUnavailableError,
  unauthorized,
  unknown,
} from '../../../../../src/app/middlewares/utils';

describe('Http Utils', () => {
  it('should return 200 status', () => {
    const response = ok({});

    expect(response).toStrictEqual({
      statusCode: 200,
      body: {},
    });
  });

  it('should return 400 status', () => {
    const error = new Error('any error');

    const response = badRequest(error);

    expect(response).toStrictEqual({
      statusCode: 400,
      body: error,
    });
  });

  it('should return 401 status', () => {
    const error = new Error('any error');

    const response = unauthorized(error);

    expect(response).toStrictEqual({
      statusCode: 401,
      body: error,
    });
  });

  it('should return 403 status', () => {
    const error = new Error('any error');

    const response = forbidden(error);

    expect(response).toStrictEqual({
      statusCode: 403,
      body: error,
    });
  });

  it('should return 500 status', () => {
    const error = new Error('any error');

    const response = serverError(error);

    expect(response).toStrictEqual({
      statusCode: 500,
      body: error,
    });
  });

  it('should return 503 status', () => {
    const error = new Error('any error');

    const response = serviceUnavailableError(error);

    expect(response).toStrictEqual({
      statusCode: 503,
      body: error,
    });
  });

  it('should return 599 status', () => {
    const error = new Error('any error');

    const response = unknown(error);

    expect(response).toStrictEqual({
      statusCode: 599,
      body: error,
    });
  });
});
