import { HttpRequest, HttpResponse } from '../contracts/http';
import { NoteService, UserService } from '../contracts/services';
import { UnfinishedNoteError, UserDoesNotExistsError } from '../errors';
import { TemplateController } from './template';
import { noContent } from './utils';

import { Validator } from '../contracts/validation';
import { ValidationBuilder, FieldOrigin } from '../validation';

export class DeleteNoteController extends TemplateController {
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
  ): Promise<HttpResponse<void>> {
    const user = await this.userService.getUser(request.headers.userId);
    if (!user) throw new UserDoesNotExistsError();
    const deleted = await this.noteService.deleteNote(request.body.id);
    if (!deleted) throw new UnfinishedNoteError(request.body.id);
    return noContent();
  }
}
