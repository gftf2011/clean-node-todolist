import { NoteDTO } from '../../../domain/dto';
import { HttpRequest } from '../../contracts/http';
import { NoteService, UserService } from '../../contracts/services';
import { UserDoesNotExistsError } from '../../errors';
import { TemplateHttpController } from '../template';
import { created } from '../utils';
import { Response } from '../../contracts/response';
import { Validator } from '../../contracts/validation';
import { ValidationBuilder, FieldOrigin } from '../../validation';

export class CreateNoteHttpController extends TemplateHttpController {
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
  ): Promise<Response<{ created: boolean }>> {
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
