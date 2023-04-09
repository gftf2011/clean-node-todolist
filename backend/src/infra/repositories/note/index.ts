/* eslint-disable max-classes-per-file */
import { NoteRepository } from '../../../domain/repositories';
import { NoteModel } from '../../../domain/models';

type NoteRepositoryAbstractProduct = NoteRepository;

class FakeLocalNoteRepositoryProduct implements NoteRepositoryAbstractProduct {
  private notes: NoteModel[] = [];

  async find(id: string): Promise<NoteModel> {
    return this.notes.find(note => note.id === id);
  }

  async findAll(page: number, limit: number): Promise<NoteModel[]> {
    return this.notes.slice((page - 1) * limit, page * limit);
  }

  async save(note: NoteModel): Promise<void> {
    this.notes.push(note);
  }

  async update(noteUpdated: NoteModel): Promise<void> {
    this.notes.forEach((note: NoteModel, index: number, array: NoteModel[]) => {
      if (note.id === noteUpdated.id) {
        // eslint-disable-next-line no-param-reassign
        array[index] = noteUpdated;
      }
    });
  }

  async delete(id: string): Promise<void> {
    this.notes = this.notes.filter(note => note.id === id);
  }
}

interface NoteRepositoryAbstractFactory {
  createRepository: () => NoteRepositoryAbstractProduct;
}

export class LocalNoteRepositoryFactory
  implements NoteRepositoryAbstractFactory
{
  public createRepository(): NoteRepositoryAbstractProduct {
    return new FakeLocalNoteRepositoryProduct();
  }
}
