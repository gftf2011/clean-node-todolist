import { HttpRequest, HttpResponse } from '../../contracts/http';
import { ErrorHandlerInvoker } from '../strategies';

import { Validator } from '../../contracts/validation';
import { Middleware } from '../../contracts/middlewares';

import { ValidationComposite } from '../../validation';

// It uses the template-method design pattern
export abstract class TemplateMiddleware implements Middleware {
  constructor() {}

  protected abstract buildHeaderValidators(_request: HttpRequest): Validator[];

  private static handleError(error: Error): HttpResponse {
    return new ErrorHandlerInvoker().handle(error);
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      this.validateHeaderParams(request);
      const response = await this.perform(request);
      return response;
    } catch (error) {
      return TemplateMiddleware.handleError(error as Error);
    }
  }

  protected abstract perform(request: HttpRequest): Promise<HttpResponse>;

  private validateHeaderParams(request: HttpRequest): void {
    const validators = this.buildHeaderValidators(request);
    new ValidationComposite(validators).validate();
  }
}
