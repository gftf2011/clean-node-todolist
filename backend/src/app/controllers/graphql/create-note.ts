import { NoteService, UserService } from '../../contracts/services';
import { UserDoesNotExistsError } from '../../errors';
import { TemplateGraphqlController } from '../template';
import { created } from '../utils';
import { Response } from '../../contracts/response';
import { GraphqlRequest } from '../../contracts/graphql';

export class CreateNoteGraphqlController extends TemplateGraphqlController {
  constructor(
    private readonly noteService: NoteService,
    private readonly userService: UserService,
  ) {
    super();
  }

  protected async perform(
    request: GraphqlRequest,
  ): Promise<Response<{ created: boolean }>> {
    const user = await this.userService.getUser(
      request.context.req.headers.userId,
    );
    if (!user) throw new UserDoesNotExistsError();
    await this.noteService.saveNote(
      request.args.input.title,
      request.args.input.description,
      request.context.req.headers.userId,
    );
    return created({ created: true });
  }
}
