import { HttpRequest } from '../../contracts/http';
import { NoteService, UserService } from '../../contracts/services';
import { UserDoesNotExistsError } from '../../errors';
import { TemplateHttpController } from '../template';
import { ok } from '../utils';
import { NotesViewModel } from '../view-models';
import { Response } from '../../contracts/response';
import { Validator } from '../../contracts/validation';
import { ValidationBuilder, FieldOrigin } from '../../validation';

export class GetNotesByUserIdHttpController extends TemplateHttpController {
  constructor(
    private readonly noteService: NoteService,
    private readonly userService: UserService,
  ) {
    super();
  }

  protected override buildHeaderValidators(request: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of()
        .and({
          value: request.headers.userId,
          fieldName: 'userId',
          fieldOrigin: FieldOrigin.HEADER,
        })
        .and({
          value: request.headers.page,
          fieldName: 'page',
          fieldOrigin: FieldOrigin.HEADER,
        })
        .and({
          value: request.headers.limit,
          fieldName: 'limit',
          fieldOrigin: FieldOrigin.HEADER,
        })
        .required()
        .build(),
    ];
  }

  protected async perform(
    request: HttpRequest<any>,
  ): Promise<Response<NotesViewModel>> {
    const user = await this.userService.getUser(request.headers.userId);
    if (!user) throw new UserDoesNotExistsError();
    const notes = await this.noteService.getNotesByUserId(
      request.headers.userId,
      request.headers.page,
      request.headers.limit,
    );
    return ok(NotesViewModel.map(notes));
  }
}
