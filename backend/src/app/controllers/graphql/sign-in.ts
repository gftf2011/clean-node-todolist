import { UserService } from '../../contracts/services';
import {
  PasswordDoesNotMatchError,
  UserDoesNotExistsError,
} from '../../errors';
import { TemplateGraphqlController } from '../template';
import { ok } from '../utils';
import { CreatedSessionViewModel } from '../view-models';
import { Response } from '../../contracts/response';
import { GraphqlRequest } from '../../contracts/graphql';

export class SignInGraphqlController extends TemplateGraphqlController {
  constructor(private readonly userService: UserService) {
    super();
  }

  protected async perform(
    request: GraphqlRequest,
  ): Promise<Response<CreatedSessionViewModel>> {
    const user = await this.userService.getUserByEmail(
      request.args.input.email,
    );
    if (!user) throw new UserDoesNotExistsError();
    const passwordDoesMatch = await this.userService.matchPassword(
      request.args.input.email,
      request.args.input.password,
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
