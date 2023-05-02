import { UserDTO } from '../../domain/dto';
import { HttpRequest, HttpResponse } from '../contracts/http';
import { UserService } from '../contracts/services';
import { UserAlreadyExistsError } from '../errors';
import { TemplateController } from './template';
import { created } from './utils';
import { CreatedSessionViewModel } from './view-models';

import { Validator } from '../contracts/validation';
import { ValidationBuilder, FieldOrigin } from '../validation';

export class SignUpController extends TemplateController {
  constructor(private readonly userService: UserService) {
    super();
  }

  protected override buildBodyValidators(request: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of()
        .and({
          value: request.body.name,
          fieldName: 'name',
          fieldOrigin: FieldOrigin.BODY,
        })
        .and({
          value: request.body.lastname,
          fieldName: 'lastname',
          fieldOrigin: FieldOrigin.BODY,
        })
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
    request: HttpRequest<UserDTO>,
  ): Promise<HttpResponse<CreatedSessionViewModel>> {
    const userExists = await this.userService.getUserByEmail(
      request.body.email,
    );
    if (userExists) throw new UserAlreadyExistsError();
    await this.userService.saveUser(request.body);
    const user = await this.userService.getUserByEmail(request.body.email);
    const accessToken = await this.userService.createSession(
      user.id,
      user.email,
    );
    return created({ accessToken });
  }
}
