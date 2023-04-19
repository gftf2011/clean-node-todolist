import { HttpRequest, HttpResponse } from '../contracts/http';
import { NoteService, UserService } from '../contracts/services';
import { UserDoesNotExistsError } from '../errors';
import { TemplateController } from './template';
import { noContent } from './utils';

import { Validator } from '../contracts/validation';
import { ValidationBuilder, FieldOrigin } from '../validation';

export class UpdateFinishedNoteController extends TemplateController {
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
        .and({
          value: request.body.finished,
          fieldName: 'finished',
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
    request: HttpRequest<{ id: string; finished: boolean }>,
  ): Promise<HttpResponse<void>> {
    const user = await this.userService.getUser(request.headers.userId);
    if (!user) throw new UserDoesNotExistsError();
    await this.noteService.updateFinishedNote(
      request.body.id,
      request.body.finished,
    );
    return noContent();
  }
}
