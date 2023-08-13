import { NoteDTO } from '../../../domain/dto';
import { NoteService, UserService } from '../../contracts/services';
import { NoteNotFoundError, UserDoesNotExistsError } from '../../errors';
import { TemplateGraphqlController } from '../template';
import { NoteViewModel } from '../view-models';
import { ok } from '../utils';
import { Response } from '../../contracts/response';
import { GraphqlRequest } from '../../contracts/graphql';

export class UpdateNoteGraphqlController extends TemplateGraphqlController {
  constructor(
    private readonly noteService: NoteService,
    private readonly userService: UserService,
  ) {
    super();
  }

  protected async perform(
    request: GraphqlRequest,
  ): Promise<Response<NoteViewModel>> {
    const user = await this.userService.getUser(
      request.context.req.headers.userId,
    );
    if (!user) throw new UserDoesNotExistsError();

    let note = await this.noteService.getNote(request.args.input.id);
    if (!note) throw new NoteNotFoundError(request.args.input.id);

    await this.noteService.updateNote(request.args.input as NoteDTO);

    note = await this.noteService.getNote(request.args.input.id);
    return ok(NoteViewModel.map(note));
  }
}
