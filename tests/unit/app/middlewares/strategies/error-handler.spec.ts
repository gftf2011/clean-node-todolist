import {
  AccessDeniedError,
  MissingHeaderParamsError,
  TokenExpiredError,
  UserDoesNotExistsError,
  DatabaseError,
  ActionNotRegisteredError,
  ServiceUnavailableError,
  ApplicationError,
  InvalidTokenSubjectError,
} from '../../../../../src/app/errors';

import { ErrorHandlerInvoker } from '../../../../../src/app/middlewares/strategies';

describe('Controller Error Handler - Middleware', () => {
  it('should return 400 if error is "MissingHeaderParamsError"', () => {
    const error = new MissingHeaderParamsError(['any field']);
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 401 if error is "TokenExpiredError"', () => {
    const error = new TokenExpiredError();
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 401 if error is "UserDoesNotExistsError"', () => {
    const error = new UserDoesNotExistsError();
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 403 if error is "AccessDeniedError"', () => {
    const error = new AccessDeniedError();
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(403);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 403 if error is "InvalidTokenSubjectError"', () => {
    const error = new InvalidTokenSubjectError();
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(403);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 500 if error is "DatabaseError"', () => {
    const error = new DatabaseError();
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 500 if error is "ActionNotRegisteredError"', () => {
    const error = new ActionNotRegisteredError({
      operation: 'any operation',
    } as any);
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 503 if error is "ServiceUnavailableError"', () => {
    const error = new ServiceUnavailableError();
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(503);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 599 if application error is unmapped', () => {
    const error = new ApplicationError();
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(599);
    expect(response.body).toStrictEqual(error);
  });

  it('should throw error if is not application error instance', () => {
    const error = new Error();
    const handler = new ErrorHandlerInvoker();
    const response = () => {
      handler.handle(error);
    };
    expect(response).toThrow();
  });
});
