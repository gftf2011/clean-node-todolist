import faker from 'faker';

import { Note } from '../../../../src/domain/entity';
import {
  InvalidIdError,
  InvalidTitleError,
  InvalidDescriptionError,
} from '../../../../src/domain/errors';

describe('Note - Entity', () => {
  it('should return "InvalidIdError" if id is invalid', () => {
    const response = Note.create('', {
      title: faker.lorem.word(10),
      description: faker.lorem.word(10),
    });
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidIdError(''));
  });

  it('should return "InvalidTitleError" if title is invalid', () => {
    const response = Note.create(
      `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      {
        title: '',
        description: faker.lorem.word(10),
      },
    );
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTitleError(''));
  });

  it('should return "InvalidDescriptionError" if description is invalid', () => {
    const response = Note.create(
      `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`,
      {
        title: faker.lorem.word(10),
        description: '',
      },
    );
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidDescriptionError(''));
  });

  it('should return "Note" with valid parameters', () => {
    const year = 1970;
    const month = 0;
    const day = 1;
    const hour = 0;
    const minute = 0;
    const second = 0;
    const millisecond = 0;

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(year, month, day, hour, minute, second, millisecond),
      );

    const id = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const title = faker.lorem.word(10);
    const description = faker.lorem.word(10);

    const response = Note.create(id, {
      title,
      description,
    });

    const note = (response.value as Note).get();

    expect(response.isRight()).toBeTruthy();
    expect(note).toEqual({
      createdAt: new Date(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
      ).toISOString(),
      description,
      finished: false,
      id,
      title,
      updatedAt: new Date(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
      ).toISOString(),
    });
  });

  it('should return "Note" with valid and optional parameters', () => {
    const timestamp = new Date();

    const id = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const title = faker.lorem.word(10);
    const description = faker.lorem.word(10);

    const response = Note.create(id, {
      title,
      description,
      finished: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const note = (response.value as Note).get();

    expect(response.isRight()).toBeTruthy();
    expect(note).toEqual({
      createdAt: timestamp.toISOString(),
      description,
      finished: true,
      id,
      title,
      updatedAt: timestamp.toISOString(),
    });
  });

  it('should update note', () => {
    const month = 0;
    const day = 1;
    const hour = 0;
    const minute = 0;
    const second = 0;
    const millisecond = 0;

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(1970, month, day, hour, minute, second, millisecond),
      );

    const id = `${'0'.repeat(17)}-${'0'.repeat(32)}-${'0'.repeat(32)}`;
    const title = faker.lorem.word(10);
    const description = faker.lorem.word(10);

    const response = Note.create(id, {
      title,
      description,
    });

    const note = response.value as Note;

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(2020, month, day, hour, minute, second, millisecond),
      );

    note.updateTime();

    expect(note.get()).toEqual({
      createdAt: new Date(
        1970,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
      ).toISOString(),
      description,
      finished: false,
      id,
      title,
      updatedAt: new Date(
        2020,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
      ).toISOString(),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});
