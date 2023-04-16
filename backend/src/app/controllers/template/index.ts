import { HttpRequest, HttpResponse } from '../../contracts/http';
import { ErrorHandlerInvoker } from '../strategies';

import { Validator } from '../../contracts/validation';

import { ValidationComposite } from '../../validation';
import { Controller } from '../../contracts/controllers';

// It uses the template-method design pattern
export abstract class TemplateController implements Controller {
  constructor() {}

  protected buildBodyValidators(_request: HttpRequest): Validator[] {
    return [];
  }

  protected buildHeaderValidators(_request: HttpRequest): Validator[] {
    return [];
  }

  protected buildUrlValidators(_request: HttpRequest): Validator[] {
    return [];
  }

  private static handleError(error: Error): HttpResponse {
    return new ErrorHandlerInvoker().handle(error);
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      this.validateBodyParams(request);
      this.validateHeaderParams(request);
      const response = await this.perform(request);
      return response;
    } catch (error) {
      return TemplateController.handleError(error as Error);
    }
  }

  protected abstract perform(request: HttpRequest): Promise<HttpResponse>;

  private validateHeaderParams(request: HttpRequest): void {
    const validators = this.buildHeaderValidators(request);
    new ValidationComposite(validators).validate();
  }

  private validateBodyParams(request: HttpRequest): void {
    const validators = this.buildBodyValidators(request);
    new ValidationComposite(validators).validate();
  }
}
