/* eslint-disable max-classes-per-file */
import {
  DomainError,
  InvalidEmailError,
  InvalidIdError,
  InvalidLastnameError,
  InvalidNameError,
  WeakPasswordError,
} from '../../../domain/errors';

import {
  ApplicationError,
  ActionNotRegisteredError,
  InvalidSequencingDomainError,
  MissingBodyParamsError,
  UserAlreadyExistsError,
  UserDoesNotExistsError,
  PasswordDoesNotMatchError,
  DatabaseError,
  ServiceUnavailableError,
  MissingUrlParamsError,
  MissingHeaderParamsError,
  UnfinishedNoteError,
  NoteNotFoundError,
} from '../../errors';
import { HttpResponse } from '../../contracts/http';

import {
  badRequest,
  unknown,
  serverError,
  forbidden,
  unauthorized,
  serviceUnavailableError,
} from '../utils';

interface ErrorHandlerStrategy {
  handle: (error: Error) => HttpResponse;
}

class DomainErrorHandlerStrategy implements ErrorHandlerStrategy {
  public handle(error: DomainError): HttpResponse {
    if (
      error instanceof InvalidEmailError ||
      error instanceof InvalidIdError ||
      error instanceof InvalidLastnameError ||
      error instanceof InvalidNameError ||
      error instanceof WeakPasswordError
    ) {
      return badRequest(error);
    }
    return unknown(error);
  }
}

class ApplicationErrorHandlerStrategy implements ErrorHandlerStrategy {
  public handle(error: ApplicationError): HttpResponse {
    if (
      error instanceof MissingBodyParamsError ||
      error instanceof MissingUrlParamsError ||
      error instanceof MissingHeaderParamsError ||
      error instanceof UnfinishedNoteError ||
      error instanceof NoteNotFoundError
    ) {
      return badRequest(error);
    }
    if (
      error instanceof UserAlreadyExistsError ||
      error instanceof PasswordDoesNotMatchError
    ) {
      return forbidden(error);
    }
    if (error instanceof UserDoesNotExistsError) {
      return unauthorized(error);
    }
    if (
      error instanceof DatabaseError ||
      error instanceof ActionNotRegisteredError ||
      error instanceof InvalidSequencingDomainError
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
    if (error instanceof DomainError) {
      this.context.setStrategy(new DomainErrorHandlerStrategy());
    } else {
      this.context.setStrategy(new ApplicationErrorHandlerStrategy());
    }
  }

  public handle(error: Error): HttpResponse {
    this.selectStrategy(error);
    return this.context.handle(error);
  }
}
