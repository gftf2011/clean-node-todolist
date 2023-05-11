import { TemplateGraphqlMiddleware } from '../template';
import { InvalidTokenSubjectError, UserDoesNotExistsError } from '../../errors';
import { ok } from '../utils';
import { UserService } from '../../contracts/services';
import { Response } from '../../contracts/response';
import { GraphqlRequest } from '../../contracts/graphql';

export class AuthGraphqlMiddleware extends TemplateGraphqlMiddleware {
  constructor(private readonly userService: UserService) {
    super();
  }

  protected async perform(
    request: GraphqlRequest,
  ): Promise<Response<{ userId: string }>> {
    const { id, sub } = await this.userService.validateToken(
      request.context.req.headers.authorization,
    );
    const user = await this.userService.getUser(id);
    if (!user) throw new UserDoesNotExistsError();

    if (sub !== user.email) throw new InvalidTokenSubjectError();

    return ok({ userId: id });
  }
}
