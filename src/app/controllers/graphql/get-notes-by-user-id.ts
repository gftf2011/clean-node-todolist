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
    const [notes1, notes2] = await Promise.all([
      this.noteService.getNotesByUserId(
        request.context.req.headers.userId,
        Number(request.args.input.page),
        Number(request.args.input.limit),
      ),
      this.noteService.getNotesByUserId(
        request.context.req.headers.userId,
        Number(request.args.input.page) + 1,
        Number(request.args.input.limit),
      ),
    ]);
    return ok(
      NotesViewModel.map(
        notes1,
        Number(request.args.input.page) !== 0,
        notes2.length !== 0,
      ),
    );
  }
}
