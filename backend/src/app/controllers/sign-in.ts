import { HttpRequest, HttpResponse } from '../contracts/http';
import { UserService } from '../contracts/services';
import { PasswordDoesNotMatchError, UserDoesNotExistsError } from '../errors';
import { TemplateController } from './template';
import { ok } from './utils';
import { CreatedSessionViewModel } from './view-models';

import { Validator } from '../contracts/validation';
import { ValidationBuilder, FieldOrigin } from '../validation';

export class SignInController extends TemplateController {
  constructor(private readonly userService: UserService) {
    super();
  }

  protected override buildBodyValidators(request: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of()
        .and({
          value: request.body.email,
          fieldName: 'email',
          fieldOrigin: FieldOrigin.BODY,
        })
        .and({
          value: request.body.password,
          fieldName: 'password',
          fieldOrigin: FieldOrigin.BODY,
        })
        .required()
        .build(),
    ];
  }

  protected async perform(
    request: HttpRequest<{ email: string; password: string }>,
  ): Promise<HttpResponse<CreatedSessionViewModel>> {
    const user = await this.userService.getUserByEmail(request.body.email);
    if (!user) throw new UserDoesNotExistsError();
    const passwordDoesMatch = await this.userService.matchPassword(
      request.body.email,
      request.body.password,
      user.password,
    );
    if (!passwordDoesMatch) throw new PasswordDoesNotMatchError();
    const accessToken = await this.userService.createSession(
      user.id,
      user.email,
    );
    return ok({ accessToken });
  }
}
