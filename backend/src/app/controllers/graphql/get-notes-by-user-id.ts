import { NoteService, UserService } from '../../contracts/services';
import { UserDoesNotExistsError } from '../../errors';
import { TemplateGraphqlController } from '../template';
import { ok } from '../utils';
import { NotesViewModel } from '../view-models';
import { Response } from '../../contracts/response';
import { GraphqlRequest } from '../../contracts/graphql';

export class GetNotesByUserIdGraphqlController extends TemplateGraphqlController {
  constructor(
    private readonly noteService: NoteService,
    private readonly userService: UserService,
  ) {
    super();
  }

  protected async perform(
    request: GraphqlRequest,
  ): Promise<Response<NotesViewModel>> {
    const user = await this.userService.getUser(
      request.context.req.headers.userId,
    );
    if (!user) throw new UserDoesNotExistsError();
    const notes = await this.noteService.getNotesByUserId(
      request.context.req.headers.userId,
      request.args.input.page,
      request.args.input.limit,
    );
    return ok(NotesViewModel.map(notes));
  }
}
