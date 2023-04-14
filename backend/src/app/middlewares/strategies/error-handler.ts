/* eslint-disable max-classes-per-file */
import { TokenExpiredError } from 'jsonwebtoken';
import {
  ApplicationError,
  AccessDeniedError,
  InvalidTokenSubjectError,
} from '../../errors';
import { HttpResponse } from '../../contracts/http';

import { unauthorized, unknown } from '../utils';
import { forbidden } from '../../controllers/utils';

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
    if (error instanceof TokenExpiredError) {
      return unauthorized(error);
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
    return;
  }

  public handle(error: Error): HttpResponse {
    this.selectStrategy(error);
    return this.context.handle(error);
  }
}
