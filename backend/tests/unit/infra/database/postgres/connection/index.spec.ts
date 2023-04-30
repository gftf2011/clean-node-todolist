import * as pg from 'pg';

jest.mock('pg');

describe('Postgres - Database Connection', () => {
  beforeEach(() => {
    /**
     * Most important - it clears the cache
     */
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create objects with the same reference', () => {
    let module: any;

    /**
     * Jest Isolation Module
     *
     * Module used is a Singleton Class, to create a fresh singleton in each test
     * it's necessary to isolate the module with jest.isolateModules
     *
     * This creates a sandbox where after the test execution the sandbox is destroyed
     */
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      module = require('../../../../../../src/infra/database/postgres/connection');
    });

    const { PostgresConnection } = module;

    const firstInstance = PostgresConnection.getInstance();
    const secondInstance = PostgresConnection.getInstance();

    expect(firstInstance === secondInstance).toBeTruthy();
  });

  it('should create pool connection - first try', async () => {
    let module: any;

    /**
     * Jest Isolation Module
     *
     * Module used is a Singleton Class, to create a fresh singleton in each test
     * it's necessary to isolate the module with jest.isolateModules
     *
     * This creates a sandbox where after the test execution the sandbox is destroyed
     */
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      module = require('../../../../../../src/infra/database/postgres/connection');
    });

    const { PostgresConnection } = module;

    const spyPoolClientRelease = jest.fn().mockImplementation(() => {});
    const spyPoolClient = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        release: spyPoolClientRelease,
      }),
    );

    const spy = jest.spyOn(pg, 'Pool').mockImplementationOnce(
      (_config: any) =>
        ({
          connect: spyPoolClient,
        } as any),
    );

    const instance = PostgresConnection.getInstance();

    const promise = instance.connect({
      idle_in_transaction_session_timeout: 1,
      query_timeout: 1,
      statement_timeout: 1,
      connectionTimeoutMillis: 1,
      database: 'database_mock',
      host: 'host_mock',
      idleTimeoutMillis: 1,
      max: 1,
      password: 'password_mock',
      port: 1,
      user: 'user_mock',
    });

    await expect(promise).resolves.toBeUndefined();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      idle_in_transaction_session_timeout: 1,
      query_timeout: 1,
      statement_timeout: 1,
      connectionTimeoutMillis: 1,
      database: 'database_mock',
      host: 'host_mock',
      idleTimeoutMillis: 1,
      max: 1,
      password: 'password_mock',
      port: 1,
      user: 'user_mock',
    });
    expect(spyPoolClient).toBeCalledTimes(1);
    expect(spyPoolClientRelease).toBeCalledTimes(1);
  });

  it('should create pool connection after pool connection fail', async () => {
    let module: any;

    /**
     * Jest Isolation Module
     *
     * Module used is a Singleton Class, to create a fresh singleton in each test
     * it's necessary to isolate the module with jest.isolateModules
     *
     * This creates a sandbox where after the test execution the sandbox is destroyed
     */
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      module = require('../../../../../../src/infra/database/postgres/connection');
    });

    const { PostgresConnection } = module;

    const spyPoolClientRelease = jest.fn().mockImplementationOnce(() => {});
    const spyPoolClient = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(new Error()))
      .mockImplementationOnce(() =>
        Promise.resolve({
          release: spyPoolClientRelease,
        }),
      );

    const spy = jest.spyOn(pg, 'Pool').mockImplementationOnce(
      (_config: any) =>
        ({
          connect: spyPoolClient,
        } as any),
    );

    const instance = PostgresConnection.getInstance();

    const promise = instance.connect({
      idle_in_transaction_session_timeout: 1,
      query_timeout: 1,
      statement_timeout: 1,
      connectionTimeoutMillis: 1,
      database: 'database_mock',
      host: 'host_mock',
      idleTimeoutMillis: 1,
      max: 1,
      password: 'password_mock',
      port: 1,
      user: 'user_mock',
    });

    await expect(promise).resolves.toBeUndefined();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      idle_in_transaction_session_timeout: 1,
      query_timeout: 1,
      statement_timeout: 1,
      connectionTimeoutMillis: 1,
      database: 'database_mock',
      host: 'host_mock',
      idleTimeoutMillis: 1,
      max: 1,
      password: 'password_mock',
      port: 1,
      user: 'user_mock',
    });
    expect(spyPoolClient).toBeCalledTimes(2);
    expect(spyPoolClientRelease).toBeCalledTimes(1);
  });

  it('should retrieve connection', async () => {
    let module: any;

    /**
     * Jest Isolation Module
     *
     * Module used is a Singleton Class, to create a fresh singleton in each test
     * it's necessary to isolate the module with jest.isolateModules
     *
     * This creates a sandbox where after the test execution the sandbox is destroyed
     */
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      module = require('../../../../../../src/infra/database/postgres/connection');
    });

    const { PostgresConnection } = module;

    const spyPoolClientRelease = jest.fn().mockImplementationOnce(() => {});
    const spyPoolClient = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          release: spyPoolClientRelease,
        }),
      )
      .mockImplementationOnce(() => Promise.resolve({} as any));

    jest.spyOn(pg, 'Pool').mockImplementationOnce(
      (_config: any) =>
        ({
          connect: spyPoolClient,
        } as any),
    );

    const instance = PostgresConnection.getInstance();

    await instance.connect({
      idle_in_transaction_session_timeout: 1,
      query_timeout: 1,
      statement_timeout: 1,
      connectionTimeoutMillis: 1,
      database: 'database_mock',
      host: 'host_mock',
      idleTimeoutMillis: 1,
      max: 1,
      password: 'password_mock',
      port: 1,
      user: 'user_mock',
    });

    const promise = instance.getConnection();

    await expect(promise).resolves.not.toBeUndefined();

    expect(spyPoolClient).toHaveBeenCalledTimes(2);
  });

  it('should disconnect pool connection', async () => {
    let module: any;

    /**
     * Jest Isolation Module
     *
     * Module used is a Singleton Class, to create a fresh singleton in each test
     * it's necessary to isolate the module with jest.isolateModules
     *
     * This creates a sandbox where after the test execution the sandbox is destroyed
     */
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      module = require('../../../../../../src/infra/database/postgres/connection');
    });

    const { PostgresConnection } = module;

    const spyPoolClientRelease = jest.fn().mockImplementationOnce(() => {});
    const spyPoolClientEnd = jest.fn().mockImplementationOnce(() => {});
    const spyPoolClient = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        release: spyPoolClientRelease,
      }),
    );

    jest.spyOn(pg, 'Pool').mockImplementationOnce(
      (_config: any) =>
        ({
          connect: spyPoolClient,
          end: spyPoolClientEnd,
        } as any),
    );

    const instance = PostgresConnection.getInstance();

    await instance.connect({
      idle_in_transaction_session_timeout: 1,
      query_timeout: 1,
      statement_timeout: 1,
      connectionTimeoutMillis: 1,
      database: 'database_mock',
      host: 'host_mock',
      idleTimeoutMillis: 1,
      max: 1,
      password: 'password_mock',
      port: 1,
      user: 'user_mock',
    });
    const promise = instance.disconnect();

    await expect(promise).resolves.toBeUndefined();

    expect(spyPoolClientEnd).toBeCalledTimes(1);
  });

  afterAll(() => {
    /**
     * Most important - restores module to original implementation
     */
    jest.restoreAllMocks();
  });
});
