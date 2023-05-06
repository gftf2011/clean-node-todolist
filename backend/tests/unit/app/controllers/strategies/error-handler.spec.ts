import {
  DomainError,
  InvalidEmailError,
  InvalidIdError,
  InvalidLastnameError,
  InvalidNameError,
  WeakPasswordError,
} from '../../../../../src/domain/errors';
import {
  MissingBodyParamsError,
  MissingHeaderParamsError,
  MissingUrlParamsError,
  NoteNotFoundError,
  PasswordDoesNotMatchError,
  UnfinishedNoteError,
  UserAlreadyExistsError,
  UserDoesNotExistsError,
  DatabaseError,
  ActionNotRegisteredError,
  InvalidSequencingDomainError,
  ServiceUnavailableError,
  ApplicationError,
} from '../../../../../src/app/errors';

import { ErrorHandlerInvoker } from '../../../../../src/app/controllers/strategies';

describe('Controller Error Handler', () => {
  it('should return 400 if error is "InvalidEmailError"', () => {
    const error = new InvalidEmailError('any email');
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 400 if error is "InvalidIdError"', () => {
    const error = new InvalidIdError('any id');
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 400 if error is "InvalidLastnameError"', () => {
    const error = new InvalidLastnameError('any lastname');
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 400 if error is "InvalidNameError"', () => {
    const error = new InvalidNameError('any name');
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 400 if error is "WeakPasswordError"', () => {
    const error = new WeakPasswordError();
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 599 if domain error is unmapped', () => {
    const error = new DomainError();
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(599);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 400 if error is "MissingBodyParamsError"', () => {
    const error = new MissingBodyParamsError(['any field']);
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 400 if error is "MissingUrlParamsError"', () => {
    const error = new MissingUrlParamsError(['any field']);
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 400 if error is "MissingHeaderParamsError"', () => {
    const error = new MissingHeaderParamsError(['any field']);
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 400 if error is "UnfinishedNoteError"', () => {
    const error = new UnfinishedNoteError('any id');
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 400 if error is "NoteNotFoundError"', () => {
    const error = new NoteNotFoundError('any id');
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 403 if error is "UserAlreadyExistsError"', () => {
    const error = new UserAlreadyExistsError();
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(403);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 403 if error is "PasswordDoesNotMatchError"', () => {
    const error = new PasswordDoesNotMatchError();
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(403);
    expect(response.body).toStrictEqual(error);
  });

  it('should return 401 if error is "UserDoesNotExistsError"', () => {
    const error = new UserDoesNotExistsError();
    const handler = new ErrorHandlerInvoker();
    const response = handler.handle(error);
    expect(response.statusCode).toBe(401);
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

  it('should return 500 if error is "InvalidSequencingDomainError"', () => {
    const error = new InvalidSequencingDomainError('any value');
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
});
