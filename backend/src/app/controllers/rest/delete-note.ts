import { HttpRequest } from '../../contracts/http';
import { NoteService, UserService } from '../../contracts/services';
import {
  NoteNotFoundError,
  UnfinishedNoteError,
  UserDoesNotExistsError,
} from '../../errors';
import { TemplateHttpController } from '../template';
import { noContent } from '../utils';
import { Response } from '../../contracts/response';
import { Validator } from '../../contracts/validation';
import { ValidationBuilder, FieldOrigin } from '../../validation';

export class DeleteNoteHttpController extends TemplateHttpController {
  constructor(
    private readonly noteService: NoteService,
    private readonly userService: UserService,
  ) {
    super();
  }

  protected override buildBodyValidators(request: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of()
        .and({
          value: request.body.id,
          fieldName: 'id',
          fieldOrigin: FieldOrigin.BODY,
        })
        .required()
        .build(),
    ];
  }

  protected override buildHeaderValidators(request: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of()
        .and({
          value: request.headers.userId,
          fieldName: 'userId',
          fieldOrigin: FieldOrigin.HEADER,
        })
        .required()
        .build(),
    ];
  }

  protected async perform(
    request: HttpRequest<{ id: string }>,
  ): Promise<Response<void>> {
    const user = await this.userService.getUser(request.headers.userId);
    if (!user) throw new UserDoesNotExistsError();
    const note = await this.noteService.getNote(request.body.id);
    if (!note) throw new NoteNotFoundError(request.body.id);
    const deleted = await this.noteService.deleteNote(request.body.id);
    if (!deleted) throw new UnfinishedNoteError(request.body.id);
    return noContent();
  }
}
