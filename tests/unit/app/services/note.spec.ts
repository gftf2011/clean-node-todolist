import { NoteDTO } from '../../../../src/domain/dto';

import {
  DeleteNoteAction,
  FindNoteAction,
  FindNotesByUserIdAction,
  CreateNoteAction,
  IsNoteFinishedAction,
  UpdateNoteAction,
} from '../../../../src/app/actions';
import { NoteServiceImpl } from '../../../../src/app/services';

import { BusMediator } from '../../../../src/infra/bus';

import {
  DeleteNoteHandlerSpy,
  FindNoteHandlerSpy,
  FindNotesByUserIdHandlerSpy,
  CreateNoteHandlerSpy,
  IsNoteFinishedHandlerSpy,
  UpdateNoteHandlerSpy,
} from '../../../doubles/spies/app/handlers';

describe('Note - Service', () => {
  it('should call "deleteNote" method', async () => {
    const handler = new DeleteNoteHandlerSpy({
      results: [true],
    });
    const bus = new BusMediator([handler]);
    const service = new NoteServiceImpl(bus);

    const id = 'id_mock';

    const response = await service.deleteNote(id);

    const action = new DeleteNoteAction({
      id,
    });

    expect(response).toBe(true);
    expect(handler.getInfo().calls).toBe(1);
    expect(handler.getInfo().data).toStrictEqual([action]);
  });

  it('should call "getNote" method', async () => {
    const note: NoteDTO = {
      description: 'description_mock',
      title: 'title_mock',
    };

    const handler = new FindNoteHandlerSpy({
      notes: [note],
    });
    const bus = new BusMediator([handler]);
    const service = new NoteServiceImpl(bus);

    const id = 'id_mock';

    const response = await service.getNote(id);

    const action = new FindNoteAction({
      id,
    });

    expect(response).toStrictEqual(note);
    expect(handler.getInfo().calls).toBe(1);
    expect(handler.getInfo().data).toStrictEqual([action]);
  });

  it('should call "getNotesByUserId" method', async () => {
    const notes: NoteDTO[] = [
      {
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        finished: false,
        description: 'description1_mock',
        title: 'title1_mock',
        id: 'id1_mock',
      },
      {
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        finished: true,
        description: 'description2_mock',
        title: 'title2_mock',
        id: 'id2_mock',
      },
    ];

    const handler = new FindNotesByUserIdHandlerSpy({
      notesArray: [notes],
    });
    const bus = new BusMediator([handler]);
    const service = new NoteServiceImpl(bus);

    const limit = 0;
    const page = 0;
    const userId = 'user_id_mock';

    const response = await service.getNotesByUserId(userId, page, limit);

    const action = new FindNotesByUserIdAction({
      userId,
      limit,
      page,
    });

    expect(response).toStrictEqual(notes);
    expect(handler.getInfo().calls).toBe(1);
    expect(handler.getInfo().data).toStrictEqual([action]);
  });

  it('should call "saveNote" method', async () => {
    const userID = 'user_id_mock';
    const note: NoteDTO = {
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      finished: false,
      description: 'description_mock',
      title: 'title_mock',
      id: 'id_mock',
    };

    const handler = new CreateNoteHandlerSpy();
    const bus = new BusMediator([handler]);
    const service = new NoteServiceImpl(bus);

    await service.saveNote(note.title, note.description, userID);

    const action = new CreateNoteAction({
      description: note.description,
      title: note.title,
      userId: userID,
    });

    expect(handler.getInfo().calls).toBe(1);
    expect(handler.getInfo().data).toStrictEqual([action]);
  });

  it('should call "updateFinishedNote" method', async () => {
    const id = 'id_mock';
    const finished = true;

    const handler = new IsNoteFinishedHandlerSpy();
    const bus = new BusMediator([handler]);
    const service = new NoteServiceImpl(bus);

    await service.updateFinishedNote(id, finished);

    const action = new IsNoteFinishedAction({
      finished,
      id,
    });

    expect(handler.getInfo().calls).toBe(1);
    expect(handler.getInfo().data).toStrictEqual([action]);
  });

  it('should call "updateNote" method', async () => {
    const note: NoteDTO = {
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      finished: true,
      description: 'description_mock',
      title: 'title_mock',
      id: 'id_mock',
    };

    const handler = new UpdateNoteHandlerSpy();
    const bus = new BusMediator([handler]);
    const service = new NoteServiceImpl(bus);

    await service.updateNote(note);

    const action = new UpdateNoteAction({
      description: note.description,
      id: note.id,
      title: note.title,
    });

    expect(handler.getInfo().calls).toBe(1);
    expect(handler.getInfo().data).toStrictEqual([action]);
  });
});
