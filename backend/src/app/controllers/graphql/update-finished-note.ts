import { NoteService, UserService } from '../../contracts/services';
import { UserDoesNotExistsError } from '../../errors';
import { TemplateGraphqlController } from '../template';
import { noContent } from '../utils';
import { Response } from '../../contracts/response';
import { GraphqlRequest } from '../../contracts/graphql';

export class UpdateFinishedNoteGraphqlController extends TemplateGraphqlController {
  constructor(
    private readonly noteService: NoteService,
    private readonly userService: UserService,
  ) {
    super();
  }

  protected async perform(request: GraphqlRequest): Promise<Response<void>> {
    const user = await this.userService.getUser(
      request.context.req.headers.userId,
    );
    if (!user) throw new UserDoesNotExistsError();
    await this.noteService.updateFinishedNote(
      request.args.input.id,
      request.args.input.finished,
    );
    return noContent();
  }
}
