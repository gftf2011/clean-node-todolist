import { UserDTO } from '../../../domain/dto';
import { UserService } from '../../contracts/services';
import { UserAlreadyExistsError } from '../../errors';
import { TemplateGraphqlController } from '../template';
import { created } from '../utils';
import { CreatedSessionViewModel } from '../view-models';
import { Response } from '../../contracts/response';
import { GraphqlRequest } from '../../contracts/graphql';

export class SignUpGraphqlController extends TemplateGraphqlController {
  constructor(private readonly userService: UserService) {
    super();
  }

  protected async perform(
    request: GraphqlRequest,
  ): Promise<Response<CreatedSessionViewModel>> {
    const userExists = await this.userService.getUserByEmail(
      request.args.input.email,
    );
    if (userExists) throw new UserAlreadyExistsError();
    await this.userService.saveUser(request.args.input as UserDTO);
    const user = await this.userService.getUserByEmail(
      request.args.input.email,
    );
    const accessToken = await this.userService.createSession(
      user.id,
      user.email,
    );
    return created({ accessToken });
  }
}
