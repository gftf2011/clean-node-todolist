import { NoteService, UserService } from '../../contracts/services';
import { UserDoesNotExistsError } from '../../errors';
import { TemplateGraphqlController } from '../template';
import { NoteViewModel } from '../view-models';
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
  ): Promise<Response<NoteViewModel>> {
    const user = await this.userService.getUser(
      request.context.req.headers.userId,
    );
    if (!user) throw new UserDoesNotExistsError();
    const noteId = await this.noteService.saveNote(
      request.args.input.title,
      request.args.input.description,
      request.context.req.headers.userId,
    );
    const note = await this.noteService.getNote(noteId);
    return created(NoteViewModel.map(note));
  }
}
