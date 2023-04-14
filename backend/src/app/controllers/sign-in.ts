import { UserDTO } from '../../domain/dto';
import { HttpRequest, HttpResponse } from '../contracts/http';
import { UserService } from '../contracts/services';
import { PasswordDoesNotMatchError, UserAlreadyExistsError } from '../errors';
import { TemplateController } from './base';
import { ok } from './utils';
import { CreatedSessionViewModel } from './view-models';

import { Validator } from '../contracts/validation';
import { ValidationBuilder, FieldOrigin } from '../validation';

export class SignInController extends TemplateController {
  constructor(private readonly userService: UserService) {
    super();
  }

  public override buildBodyValidators(request: HttpRequest): Validator[] {
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

  public async perform(
    request: HttpRequest<UserDTO>,
  ): Promise<HttpResponse<CreatedSessionViewModel>> {
    const user = await this.userService.getUserByEmail(request.body.email);
    if (!user) throw new UserAlreadyExistsError();
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
    const createdSession = CreatedSessionViewModel.map(accessToken);
    return ok(createdSession);
  }
}
