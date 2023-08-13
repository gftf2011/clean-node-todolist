import { HttpRequest } from '../../contracts/http';
import { NoteService, UserService } from '../../contracts/services';
import { NoteNotFoundError, UserDoesNotExistsError } from '../../errors';
import { TemplateHttpController } from '../template';
import { NoteViewModel } from '../view-models';
import { ok } from '../utils';
import { Response } from '../../contracts/response';
import { Validator } from '../../contracts/validation';
import { ValidationBuilder, FieldOrigin } from '../../validation';

export class UpdateFinishedNoteHttpController extends TemplateHttpController {
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
  ): Promise<Response<NoteViewModel>> {
    const user = await this.userService.getUser(request.headers.userId);
    if (!user) throw new UserDoesNotExistsError();

    let note = await this.noteService.getNote(request.body.id);
    if (!note) throw new NoteNotFoundError(request.body.id);

    await this.noteService.updateFinishedNote(
      request.body.id,
      request.body.finished,
    );

    note = await this.noteService.getNote(request.body.id);
    return ok(NoteViewModel.map(note));
  }
}
