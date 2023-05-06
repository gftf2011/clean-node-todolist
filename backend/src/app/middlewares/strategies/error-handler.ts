/* eslint-disable max-classes-per-file */
import {
  ApplicationError,
  AccessDeniedError,
  InvalidTokenSubjectError,
  DatabaseError,
  TokenExpiredError,
  ServiceUnavailableError,
  MissingHeaderParamsError,
  UserDoesNotExistsError,
  ActionNotRegisteredError,
} from '../../errors';
import { HttpResponse } from '../../contracts/http';

import {
  serverError,
  serviceUnavailableError,
  unauthorized,
  unknown,
  forbidden,
  badRequest,
} from '../utils';

interface ErrorHandlerStrategy {
  handle: (error: Error) => HttpResponse;
}

class ApplicationErrorHandlerStrategy implements ErrorHandlerStrategy {
  public handle(error: ApplicationError): HttpResponse {
    if (
      error instanceof AccessDeniedError ||
      error instanceof InvalidTokenSubjectError
    ) {
      return forbidden(error);
    }
    if (
      error instanceof TokenExpiredError ||
      error instanceof UserDoesNotExistsError
    ) {
      return unauthorized(error);
    }
    if (error instanceof MissingHeaderParamsError) {
      return badRequest(error);
    }
    if (
      error instanceof DatabaseError ||
      error instanceof ActionNotRegisteredError
    ) {
      return serverError(error);
    }
    if (error instanceof ServiceUnavailableError) {
      return serviceUnavailableError(error);
    }
    return unknown(error);
  }
}

class ErrorHandlerContext {
  private strategy: ErrorHandlerStrategy;

  public setStrategy(strategy: ErrorHandlerStrategy): void {
    this.strategy = strategy;
  }

  public handle(error: Error): HttpResponse {
    return this.strategy.handle(error);
  }
}

export class ErrorHandlerInvoker {
  private context: ErrorHandlerContext;

  constructor() {
    this.context = new ErrorHandlerContext();
  }

  private selectStrategy(error: Error): void {
    if (error instanceof ApplicationError) {
      this.context.setStrategy(new ApplicationErrorHandlerStrategy());
    }
  }

  public handle(error: Error): HttpResponse {
    this.selectStrategy(error);
    return this.context.handle(error);
  }
}
