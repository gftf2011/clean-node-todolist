import faker from 'faker';

import {
  ServiceUnavailableError,
  DatabaseError,
} from '../../../../../../src/app/errors';

import { DatabaseCircuitBreakerProxy } from '../../../../../../src/infra/database/postgres/proxies';

import { DatabaseQueryStub } from '../../../../../doubles/stubs/infra/database';

describe('Circuit Breaker - Proxy', () => {
  it('should state begin CLOSED', async () => {
    const mockedResponse = Promise.resolve({
      rows: [] as any[],
    } as any);

    const stub = new DatabaseQueryStub([mockedResponse]);
    const sut = new DatabaseCircuitBreakerProxy(stub);

    expect(sut.getState()).toBe('CLOSED');
  });

  it('should success count start with 0', async () => {
    const mockedResponse = Promise.resolve({
      rows: [] as any[],
    } as any);

    const stub = new DatabaseQueryStub([mockedResponse]);
    const sut = new DatabaseCircuitBreakerProxy(stub);

    expect(sut.getSuccessCount()).toBe(0);
  });

  it('should fail count start with 0', async () => {
    const mockedResponse = Promise.resolve({
      rows: [] as any[],
    } as any);

    const stub = new DatabaseQueryStub([mockedResponse]);
    const sut = new DatabaseCircuitBreakerProxy(stub);

    expect(sut.getFailCount()).toBe(0);
  });

  it('should return query', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const mockedResponse = Promise.resolve({
      rows: [] as any[],
    } as any);
    const input = {
      queryText: 'any_query_text',
      values: ['any_value_1', 'any_value_2'],
    };

    const stub = new DatabaseQueryStub([mockedResponse]);
    const sut = new DatabaseCircuitBreakerProxy(stub);

    const response = await sut.query(input);

    expect(sut.getState()).toBe('CLOSED');
    expect(response).toEqual({ rows: [] });
  });

  it('should throw error if operation failed for the first time', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const input = {
      queryText: 'any_query_text',
      values: ['any_value_1', 'any_value_2'],
    };

    const stub = new DatabaseQueryStub([Promise.reject(new Error())]);
    const sut = new DatabaseCircuitBreakerProxy(stub);

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    expect(sut.getSuccessCount()).toBe(0);
  });

  it('should throw error if operation failed for the second time AND state is half opened', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const input = {
      queryText: 'any_query_text',
      values: ['any_value_1', 'any_value_2'],
    };

    const stub = new DatabaseQueryStub([
      Promise.reject(new Error()),
      Promise.reject(new Error()),
    ]);
    const sut = new DatabaseCircuitBreakerProxy(stub);

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    expect(sut.getState()).toBe('HALF');
    expect(sut.getFailCount()).toBe(2);
  });

  it('should state be OPENED when fail percentage is higher than 50% AND request threshold is hit', async () => {
    const year = faker.datatype.number({ min: 2000, max: 2050 });
    const month = faker.datatype.number({ min: 0, max: 11 });
    const day = faker.datatype.number({ min: 1, max: 31 });
    const hour = faker.datatype.number({ min: 0, max: 23 });
    const minute = faker.datatype.number({ min: 0, max: 59 });
    const second = faker.datatype.number({ min: 0, max: 59 });
    const millisecond = faker.datatype.number({ min: 0, max: 999 });

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(year, month, day, hour, minute, second, millisecond),
      );

    const input = {
      queryText: 'any_query_text',
      values: ['any_value_1', 'any_value_2'],
    };

    const stub = new DatabaseQueryStub([
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
    ]);
    const sut = new DatabaseCircuitBreakerProxy(stub);

    // In this scenario fail percentage will be 100%
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    expect(sut.getState()).toBe('HALF');
    expect(sut.getFailCount()).toBe(9);

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    expect(sut.getState()).toBe('OPENED');
    expect(sut.getSuccessCount()).toBe(0);
    expect(sut.getFailCount()).toBe(0);
  });

  it('should throw service unavailable when state is OPENED', async () => {
    const year = faker.datatype.number({ min: 2000, max: 2050 });
    const month = faker.datatype.number({ min: 0, max: 11 });
    const day = faker.datatype.number({ min: 1, max: 31 });
    const hour = faker.datatype.number({ min: 0, max: 23 });
    const minute = faker.datatype.number({ min: 0, max: 59 });
    const second = faker.datatype.number({ min: 0, max: 59 });
    const millisecond = faker.datatype.number({ min: 0, max: 999 });

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(year, month, day, hour, minute, second, millisecond),
      );

    const input = {
      queryText: 'any_query_text',
      values: ['any_value_1', 'any_value_2'],
    };

    const stub = new DatabaseQueryStub([
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
    ]);
    const sut = new DatabaseCircuitBreakerProxy(stub);

    // In this scenario fail percentage will be 100%
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    await expect(sut.query(input)).rejects.toThrow(
      new ServiceUnavailableError(),
    );

    expect(sut.getState()).toBe('OPENED');
    expect(sut.getSuccessCount()).toBe(0);
    expect(sut.getFailCount()).toBe(0);
  });

  it('should count success AND fails when state is HALF', async () => {
    const year = faker.datatype.number({ min: 2000, max: 2050 });
    const month = faker.datatype.number({ min: 0, max: 11 });
    const day = faker.datatype.number({ min: 1, max: 31 });
    const hour = faker.datatype.number({ min: 0, max: 23 });
    const minute = faker.datatype.number({ min: 0, max: 59 });
    const second = faker.datatype.number({ min: 0, max: 59 });
    const millisecond = faker.datatype.number({ min: 0, max: 999 });

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(year, month, day, hour, minute, second, millisecond),
      );

    const mockedResponse = {
      rows: [] as any[],
    } as any;
    const input = {
      queryText: 'any_query_text',
      values: ['any_value_1', 'any_value_2'],
    };

    const stub = new DatabaseQueryStub([
      Promise.reject(new Error()),
      Promise.resolve(mockedResponse),
    ]);
    const sut = new DatabaseCircuitBreakerProxy(stub);

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    const response = await sut.query(input);

    expect(sut.getState()).toBe('HALF');
    expect(sut.getSuccessCount()).toBe(1);
    expect(sut.getFailCount()).toBe(1);
    expect(response).toEqual(mockedResponse);
  });

  it('should reset state to CLOSED when state was HALF AND minimum fail threshold was not hit', async () => {
    const year = faker.datatype.number({ min: 2000, max: 2050 });
    const month = faker.datatype.number({ min: 0, max: 11 });
    const day = faker.datatype.number({ min: 1, max: 31 });
    const hour = faker.datatype.number({ min: 0, max: 23 });
    const minute = faker.datatype.number({ min: 0, max: 59 });
    const second = faker.datatype.number({ min: 0, max: 59 });
    const millisecond = faker.datatype.number({ min: 0, max: 999 });

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(year, month, day, hour, minute, second, millisecond),
      );

    const mockedResponse = {
      rows: [] as any[],
    } as any;
    const input = {
      queryText: 'any_query_text',
      values: ['any_value_1', 'any_value_2'],
    };

    const stub = new DatabaseQueryStub([
      Promise.reject(new Error()),
      Promise.resolve(mockedResponse),
      Promise.resolve(mockedResponse),
    ]);

    const sut = new DatabaseCircuitBreakerProxy(stub);

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    await sut.query(input);

    expect(sut.getState()).toBe('HALF');
    expect(sut.getSuccessCount()).toBe(1);
    expect(sut.getFailCount()).toBe(1);

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(year, month, day, hour, minute, second, millisecond + 60001),
      );

    const response = await sut.query(input);

    expect(sut.getState()).toBe('CLOSED');
    expect(sut.getSuccessCount()).toBe(0);
    expect(sut.getFailCount()).toBe(0);
    expect(response).toEqual(mockedResponse);
  });

  it('should keep state HALF if minimum fail threshold was not hit AND last call after time tracker failed', async () => {
    const year = faker.datatype.number({ min: 2000, max: 2050 });
    const month = faker.datatype.number({ min: 0, max: 11 });
    const day = faker.datatype.number({ min: 1, max: 31 });
    const hour = faker.datatype.number({ min: 0, max: 23 });
    const minute = faker.datatype.number({ min: 0, max: 59 });
    const second = faker.datatype.number({ min: 0, max: 59 });
    const millisecond = faker.datatype.number({ min: 0, max: 999 });

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(year, month, day, hour, minute, second, millisecond),
      );

    const input = {
      queryText: 'any_query_text',
      values: ['any_value_1', 'any_value_2'],
    };

    const stub = new DatabaseQueryStub([
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
    ]);
    const sut = new DatabaseCircuitBreakerProxy(stub);

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    expect(sut.getState()).toBe('HALF');
    expect(sut.getSuccessCount()).toBe(0);
    expect(sut.getFailCount()).toBe(9);

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(year, month, day, hour, minute, second, millisecond + 60001),
      );

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    expect(sut.getState()).toBe('HALF');
    expect(sut.getSuccessCount()).toBe(0);
    expect(sut.getFailCount()).toBe(1);
  });

  it('should state be reset AND stay HALF if minimum threshold was hit BUT fail percentage was not hit', async () => {
    const year = faker.datatype.number({ min: 2000, max: 2050 });
    const month = faker.datatype.number({ min: 0, max: 11 });
    const day = faker.datatype.number({ min: 1, max: 31 });
    const hour = faker.datatype.number({ min: 0, max: 23 });
    const minute = faker.datatype.number({ min: 0, max: 59 });
    const second = faker.datatype.number({ min: 0, max: 59 });
    const millisecond = faker.datatype.number({ min: 0, max: 999 });

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(year, month, day, hour, minute, second, millisecond),
      );

    const mockedResponse = {
      rows: [] as any[],
    } as any;
    const input = {
      queryText: 'any_query_text',
      values: ['any_value_1', 'any_value_2'],
    };

    const stub = new DatabaseQueryStub([
      Promise.reject(new Error()),
      Promise.resolve(mockedResponse),
      Promise.resolve(mockedResponse),
      Promise.resolve(mockedResponse),
      Promise.resolve(mockedResponse),
      Promise.resolve(mockedResponse),
      Promise.resolve(mockedResponse),
      Promise.resolve(mockedResponse),
      Promise.resolve(mockedResponse),
      Promise.resolve(mockedResponse),
      Promise.resolve(mockedResponse),
      Promise.resolve(mockedResponse),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
    ]);

    const sut = new DatabaseCircuitBreakerProxy(stub);

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    await expect(sut.query(input)).resolves.toEqual(mockedResponse);
    await expect(sut.query(input)).resolves.toEqual(mockedResponse);
    await expect(sut.query(input)).resolves.toEqual(mockedResponse);
    await expect(sut.query(input)).resolves.toEqual(mockedResponse);
    await expect(sut.query(input)).resolves.toEqual(mockedResponse);
    await expect(sut.query(input)).resolves.toEqual(mockedResponse);
    await expect(sut.query(input)).resolves.toEqual(mockedResponse);
    await expect(sut.query(input)).resolves.toEqual(mockedResponse);
    await expect(sut.query(input)).resolves.toEqual(mockedResponse);
    await expect(sut.query(input)).resolves.toEqual(mockedResponse);
    await expect(sut.query(input)).resolves.toEqual(mockedResponse);

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    expect(sut.getState()).toBe('HALF');
    expect(sut.getSuccessCount()).toBe(11);
    expect(sut.getFailCount()).toBe(9);

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    expect(sut.getState()).toBe('HALF');
    expect(sut.getSuccessCount()).toBe(0);
    expect(sut.getFailCount()).toBe(1);
  });

  it('should keep state OPENED AND return error if minimum waiting time passed', async () => {
    const year = faker.datatype.number({ min: 2000, max: 2050 });
    const month = faker.datatype.number({ min: 0, max: 11 });
    const day = faker.datatype.number({ min: 1, max: 31 });
    const hour = faker.datatype.number({ min: 0, max: 23 });
    const minute = faker.datatype.number({ min: 0, max: 59 });
    const second = faker.datatype.number({ min: 0, max: 59 });
    const millisecond = faker.datatype.number({ min: 0, max: 999 });

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(year, month, day, hour, minute, second, millisecond),
      );

    const input = {
      queryText: 'any_query_text',
      values: ['any_value_1', 'any_value_2'],
    };

    const stub = new DatabaseQueryStub([
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
    ]);
    const sut = new DatabaseCircuitBreakerProxy(stub);

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    await expect(sut.query(input)).rejects.toThrow(
      new ServiceUnavailableError(),
    );

    expect(sut.getState()).toBe('OPENED');

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(year, month, day, hour, minute, second, millisecond + 60001),
      );

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    expect(sut.getState()).toBe('OPENED');
  });

  it('should return state to CLOSED after OPENED state AND after minimum waiting time passed had a success call', async () => {
    const year = faker.datatype.number({ min: 2000, max: 2050 });
    const month = faker.datatype.number({ min: 0, max: 11 });
    const day = faker.datatype.number({ min: 1, max: 31 });
    const hour = faker.datatype.number({ min: 0, max: 23 });
    const minute = faker.datatype.number({ min: 0, max: 59 });
    const second = faker.datatype.number({ min: 0, max: 59 });
    const millisecond = faker.datatype.number({ min: 0, max: 999 });

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(year, month, day, hour, minute, second, millisecond),
      );

    const mockedResponse = {
      rows: [] as any[],
    } as any;
    const input = {
      queryText: 'any_query_text',
      values: ['any_value_1', 'any_value_2'],
    };

    const stub = new DatabaseQueryStub([
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.reject(new Error()),
      Promise.resolve(mockedResponse),
    ]);

    const sut = new DatabaseCircuitBreakerProxy(stub);

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());
    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    expect(sut.getState()).toBe('HALF');

    await expect(sut.query(input)).rejects.toThrow(new DatabaseError());

    await expect(sut.query(input)).rejects.toThrow(
      new ServiceUnavailableError(),
    );

    expect(sut.getState()).toBe('OPENED');

    jest
      .useFakeTimers()
      .setSystemTime(
        new Date(year, month, day, hour, minute, second, millisecond + 60001),
      );

    await expect(sut.query(input)).resolves.toEqual(mockedResponse);

    expect(sut.getState()).toBe('CLOSED');
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
