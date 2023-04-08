import { HttpRequest, HttpResponse } from '../../contracts/http';
import { MissingBodyParamsError, MissingHeaderParamsError } from '../../errors';
import { ErrorHandlerInvoker } from '../strategies';

// It uses the template-method design pattern
export abstract class TemplateController {
  protected requiredParams: string[] = [];

  protected requiredHeaderParams: string[] = [];

  constructor() {}

  public static handleError(error: Error): HttpResponse {
    return new ErrorHandlerInvoker().handle(error);
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingBodyParams = TemplateController.getMissingBodyParams(
        request,
        this.requiredParams,
      );
      const missingHeaderParams = TemplateController.getMissingHeaderParams(
        request,
        this.requiredHeaderParams,
      );

      if (missingBodyParams.length !== 0)
        throw new MissingBodyParamsError(missingBodyParams);
      if (missingHeaderParams.length !== 0)
        throw new MissingHeaderParamsError(missingHeaderParams);

      const response = await this.perform(request);
      return response;
    } catch (error) {
      return TemplateController.handleError(error as Error);
    }
  }

  public abstract perform(request: HttpRequest): Promise<HttpResponse>;

  private static getMissingBodyParams(
    request: HttpRequest,
    requiredParams: string[],
  ): string[] {
    const missingParams: string[] = [];
    requiredParams.forEach(name => {
      if (!Object.keys(request.body).includes(name)) {
        missingParams.push(name);
      }
    });
    return missingParams;
  }

  private static getMissingHeaderParams(
    request: HttpRequest,
    requiredHeaderParams: string[],
  ): string[] {
    const missingHeaderParams: string[] = [];
    requiredHeaderParams.forEach(name => {
      if (!Object.keys(request.body).includes(name)) {
        missingHeaderParams.push(name);
      }
    });
    return missingHeaderParams;
  }
}
