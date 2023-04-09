import { Either, left, right } from '../../../shared';

import { Description, ID, Title } from '../../value-objects';

type Props = {
  id: string;
  finished: boolean;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type Input = {
  finished?: boolean;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type Output = {
  id: string;
  finished: boolean;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export class Note {
  private constructor(private value: Props) {}

  public get(): Output {
    const { createdAt, description, finished, id, title, updatedAt } =
      this.value;
    const note: Output = {
      createdAt,
      description,
      finished,
      id,
      title,
      updatedAt,
    };
    return note;
  }

  public updateTime(): void {
    const currentTime = new Date().toISOString();

    this.value = {
      ...this.value,
      updatedAt: currentTime,
    };
  }

  public static create(id: string, note: Input): Either<Error, Note> {
    const { description, title, createdAt, finished, updatedAt } = note;

    const idOrError = ID.create(id);
    const titleOrError = Title.create(title);
    const descriptionOrError = Description.create(description);

    if (idOrError.isLeft()) {
      return left(idOrError.value);
    }

    if (titleOrError.isLeft()) {
      return left(titleOrError.value);
    }

    if (descriptionOrError.isLeft()) {
      return left(descriptionOrError.value);
    }

    const currentTime = new Date().toISOString();

    return right(
      new Note({
        id: idOrError.value.get(),
        finished: finished || false,
        createdAt: createdAt ? createdAt.toISOString() : currentTime,
        updatedAt: updatedAt ? updatedAt.toISOString() : currentTime,
        description: descriptionOrError.value.get(),
        title: titleOrError.value.get(),
      }),
    );
  }
}
