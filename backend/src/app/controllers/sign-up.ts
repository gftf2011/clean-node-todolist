import { UserDTO } from '../../domain/dto';
import { HttpRequest, HttpResponse } from '../contracts/http';
import { UserService } from '../contracts/services';
import { UserAlreadyExistsError } from '../errors';
import { TemplateController } from './base';
import { created } from './utils';
import { CreatedSessionViewModel } from './view-models';

export class SignUpController extends TemplateController {
  protected override requiredParams: string[] = [
    'name',
    'lastname',
    'email',
    'password',
  ];

  constructor(private readonly userService: UserService) {
    super();
  }

  public async perform(
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
      request.body.email,
    );
    const createdSession = CreatedSessionViewModel.map(accessToken);
    return created(createdSession);
  }
}
