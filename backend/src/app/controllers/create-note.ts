import { NoteDTO } from '../../domain/dto';
import { HttpRequest, HttpResponse } from '../contracts/http';
import { NoteService, UserService } from '../contracts/services';
import { UserDoesNotExistsError } from '../errors';
import { TemplateController } from './template';
import { created } from './utils';
import { CreatedNoteViewModel } from './view-models';

import { Validator } from '../contracts/validation';
import { ValidationBuilder, FieldOrigin } from '../validation';

export class CreateNoteController extends TemplateController {
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
          value: request.body.title,
          fieldName: 'title',
          fieldOrigin: FieldOrigin.BODY,
        })
        .and({
          value: request.body.description,
          fieldName: 'description',
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
    request: HttpRequest<NoteDTO>,
  ): Promise<HttpResponse<{ created: boolean }>> {
    const user = await this.userService.getUser(request.headers.userId);
    if (!user) throw new UserDoesNotExistsError();
    await this.noteService.saveNote(
      request.body.title,
      request.body.description,
      request.headers.userId,
    );
    return created({ created: true });
  }
}