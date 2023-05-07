import { HttpRequest, HttpResponse } from '../contracts/http';
import { TemplateMiddleware } from './template';
import { InvalidTokenSubjectError, UserDoesNotExistsError } from '../errors';
import { Validator } from '../contracts/validation';
import { FieldOrigin, ValidationBuilder } from '../validation';
import { ok } from './utils';
import { UserService } from '../contracts/services';

export class AuthMiddleware extends TemplateMiddleware {
  constructor(private readonly userService: UserService) {
    super();
  }

  protected buildHeaderValidators(request: HttpRequest<any>): Validator[] {
    return [
      ...ValidationBuilder.of()
        .and({
          value: request.headers.authorization,
          fieldName: 'authorization',
          fieldOrigin: FieldOrigin.HEADER,
        })
        .required()
        .build(),
    ];
  }

  protected async perform(
    request: HttpRequest<any>,
  ): Promise<HttpResponse<{ userId: string }>> {
    const { id, sub } = await this.userService.validateToken(
      request.headers.authorization,
    );
    const user = await this.userService.getUser(id);
    if (!user) throw new UserDoesNotExistsError();

    if (sub !== user.email) throw new InvalidTokenSubjectError();

    return ok({ userId: id });
  }
}
