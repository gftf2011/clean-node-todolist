import { NoteDTO } from '../../domain/dto';
import { HttpRequest, HttpResponse } from '../contracts/http';
import { NoteService, UserService } from '../contracts/services';
import { UserDoesNotExistsError } from '../errors';
import { TemplateController } from './base';
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

  public override buildBodyValidators(request: HttpRequest): Validator[] {
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

  public override buildHeaderValidators(request: HttpRequest): Validator[] {
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
