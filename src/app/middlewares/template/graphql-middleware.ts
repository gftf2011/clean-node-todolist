import { Response } from '../../contracts/response';
import { ErrorHandlerInvoker } from '../strategies';

import { Middleware } from '../../contracts/middlewares';

import { GraphqlRequest } from '../../contracts/graphql';

// It uses the template-method design pattern
export abstract class TemplateGraphqlMiddleware implements Middleware {
  private static handleError(error: Error): Response {
    return new ErrorHandlerInvoker().handle(error);
  }

  public async handle(request: GraphqlRequest): Promise<Response> {
    try {
      const response = await this.perform(request);
      return response;
    } catch (error) {
      return TemplateGraphqlMiddleware.handleError(error as Error);
    }
  }

  protected abstract perform(request: GraphqlRequest): Promise<Response>;
}
