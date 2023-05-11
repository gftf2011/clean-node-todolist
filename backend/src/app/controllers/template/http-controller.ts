import { HttpRequest } from '../../contracts/http';
import { ErrorHandlerInvoker } from '../strategies';

import { Validator } from '../../contracts/validation';

import { ValidationComposite } from '../../validation';
import { Controller } from '../../contracts/controllers';
import { Response } from '../../contracts/response';

// It uses the template-method design pattern
export abstract class TemplateHttpController implements Controller {
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

  private static handleError(error: Error): Response {
    return new ErrorHandlerInvoker().handle(error);
  }

  public async handle(request: HttpRequest): Promise<Response> {
    try {
      this.validateBodyParams(request);
      this.validateHeaderParams(request);
      this.validateUrlParams(request);
      const response = await this.perform(request);
      return response;
    } catch (error) {
      return TemplateHttpController.handleError(error as Error);
    }
  }

  protected abstract perform(request: HttpRequest): Promise<Response>;

  private validateHeaderParams(request: HttpRequest): void {
    const validators = this.buildHeaderValidators(request);
    new ValidationComposite(validators).validate();
  }

  private validateBodyParams(request: HttpRequest): void {
    const validators = this.buildBodyValidators(request);
    new ValidationComposite(validators).validate();
  }

  private validateUrlParams(request: HttpRequest): void {
    const validators = this.buildUrlValidators(request);
    new ValidationComposite(validators).validate();
  }
}
