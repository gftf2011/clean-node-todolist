import { NoteDTO } from '../../domain/dto';
import { HttpRequest, HttpResponse } from '../contracts/http';
import { NoteService, UserService } from '../contracts/services';
import { UserDoesNotExistsError } from '../errors';
import { TemplateController } from './base';
import { created } from './utils';
import { CreatedNoteViewModel } from './view-models';

export class CreateNoteController extends TemplateController {
  protected override requiredParams: string[] = ['title', 'description'];

  protected override requiredHeaderParams: string[] = ['userId'];

  constructor(
    private readonly noteService: NoteService,
    private readonly userService: UserService,
  ) {
    super();
  }

  public async perform(
    request: HttpRequest<NoteDTO>,
  ): Promise<HttpResponse<CreatedNoteViewModel>> {
    const user = await this.userService.getUser(request.headers.userId);
    if (!user) throw new UserDoesNotExistsError();
    const noteId = await this.noteService.saveNote(
      request.body.title,
      request.body.description,
      request.headers.userId,
    );
    const note = await this.noteService.getNote(noteId);
    return created(CreatedNoteViewModel.map(note));
  }
}
