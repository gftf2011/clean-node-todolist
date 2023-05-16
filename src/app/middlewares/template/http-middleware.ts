import { HttpRequest } from '../../contracts/http';
import { Response } from '../../contracts/response';
import { ErrorHandlerInvoker } from '../strategies';

import { Validator } from '../../contracts/validation';
import { Middleware } from '../../contracts/middlewares';

import { ValidationComposite } from '../../validation';

// It uses the template-method design pattern
export abstract class TemplateHttpMiddleware implements Middleware {
  constructor() {}

  protected abstract buildHeaderValidators(_request: HttpRequest): Validator[];

  private static handleError(error: Error): Response {
    return new ErrorHandlerInvoker().handle(error);
  }

  public async handle(request: HttpRequest): Promise<Response> {
    try {
      this.validateHeaderParams(request);
      const response = await this.perform(request);
      return response;
    } catch (error) {
      return TemplateHttpMiddleware.handleError(error as Error);
    }
  }

  protected abstract perform(request: HttpRequest): Promise<Response>;

  private validateHeaderParams(request: HttpRequest): void {
    const validators = this.buildHeaderValidators(request);
    new ValidationComposite(validators).validate();
  }
}
