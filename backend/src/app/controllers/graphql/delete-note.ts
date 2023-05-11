import { NoteService, UserService } from '../../contracts/services';
import { UnfinishedNoteError, UserDoesNotExistsError } from '../../errors';
import { TemplateGraphqlController } from '../template';
import { noContent } from '../utils';
import { Response } from '../../contracts/response';
import { GraphqlRequest } from '../../contracts/graphql';

export class DeleteNoteGraphqlController extends TemplateGraphqlController {
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
    const deleted = await this.noteService.deleteNote(request.args.input.id);
    if (!deleted) throw new UnfinishedNoteError(request.args.input.id);
    return noContent();
  }
}
