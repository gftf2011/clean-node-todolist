import { GraphqlRequest } from '../../contracts/graphql';

import { ErrorHandlerInvoker } from '../strategies';

import { Controller } from '../../contracts/controllers';

import { Response } from '../../contracts/response';

// It uses the template-method design pattern
export abstract class TemplateGraphqlController implements Controller {
  private static handleError(error: Error): Response {
    return new ErrorHandlerInvoker().handle(error);
  }

  public async handle(request: GraphqlRequest): Promise<Response> {
    try {
      const response = await this.perform(request);
      return response;
    } catch (error) {
      return TemplateGraphqlController.handleError(error as Error);
    }
  }

  protected abstract perform(request: GraphqlRequest): Promise<Response>;
}
