import { DatabaseError, ServiceUnavailableError } from '../../../../app/errors';
import { DatabaseQuery } from '../../../../app/contracts/database';

type CircuitBreakerOptions = {
  openBreakerTimeoutInMs?: number;
  closedBreakerTimeoutInMs?: number;
  halfBreakerTimeoutInMs?: number;
  minFailedRequestThreshold?: number;
  percentageFailedRequestsThreshold?: number;
};

enum CircuitBreakerState {
  OPENED = 'OPENED',
  CLOSED = 'CLOSED',
  HALF = 'HALF',
}

/**
 * @author Vladimir Topolev
 * @link https://medium.com/geekculture/nodejs-circuit-breaker-pattern-ed6b31896a57
 * @desc Controls the Database query operation
 * - It uses the {@link https://refactoring.guru/design-patterns/proxy Proxy} design pattern
 * - It uses the {@link https://microservices.io/patterns/reliability/circuit-breaker.html Circuit Breaker} architecture pattern
 */
export class DatabaseCircuitBreakerProxy implements DatabaseQuery {
  private options: CircuitBreakerOptions;

  private state = CircuitBreakerState.CLOSED;

  private minWaitingTimeInMs: number = Date.now();

  private halfBreakerTimeoutInMs = 60000;

  private failCount = 0;

  private successCount = 0;

  constructor(private readonly operation: DatabaseQuery) {
    this.options = {
      halfBreakerTimeoutInMs: 60000,
      openBreakerTimeoutInMs: 5000,
      closedBreakerTimeoutInMs: 10000,
      minFailedRequestThreshold: 10,
      percentageFailedRequestsThreshold: 50,
    };
    const timestamp = Date.now();

    this.halfBreakerTimeoutInMs =
      timestamp + this.options.halfBreakerTimeoutInMs;
  }

  private setFailCount(failCount: number): void {
    this.failCount = failCount;
  }

  private setSuccessCount(successCount: number): void {
    this.successCount = successCount;
  }

  public getFailCount(): number {
    return this.failCount;
  }

  public getSuccessCount(): number {
    return this.successCount;
  }

  private increaseFailCount(): void {
    this.failCount++;
  }

  private increaseSuccessCount(): void {
    this.successCount++;
  }

  private setHalfBreakerTimeoutInMs(timestamp: number): void {
    this.halfBreakerTimeoutInMs = timestamp;
  }

  private setMinWaitingTimeInMs(timestamp: number): void {
    this.minWaitingTimeInMs = timestamp;
  }

  private getMinWaitingTimeInMs(): number {
    return this.minWaitingTimeInMs;
  }

  private setState(state: CircuitBreakerState): void {
    this.state = state;
  }

  public getState(): CircuitBreakerState {
    return this.state;
  }

  private getHalfBreakerTimeoutInMs(): number {
    return this.halfBreakerTimeoutInMs;
  }

  private getMinFailedRequestThreshold(): number {
    return this.options.minFailedRequestThreshold;
  }

  private getPercentageFailedRequestsThreshold(): number {
    return this.options.percentageFailedRequestsThreshold;
  }

  async query(input: any): Promise<any> {
    const timestampNow = Date.now();

    if (
      this.getState() === CircuitBreakerState.OPENED &&
      this.getMinWaitingTimeInMs() > timestampNow
    ) {
      throw new ServiceUnavailableError();
    }
    try {
      const response = await this.operation.query(input);
      return this.success(response);
    } catch (error) {
      throw this.fail(new DatabaseError());
    }
  }

  private reset(): void {
    const newTimestamp = Date.now() + this.options.halfBreakerTimeoutInMs;

    this.setSuccessCount(0);
    this.setFailCount(0);
    this.setHalfBreakerTimeoutInMs(newTimestamp);
  }

  private success(response: any): any {
    const currentState = this.getState();

    let state = currentState;

    if (currentState === CircuitBreakerState.HALF) {
      const timestampNow = Date.now();

      this.increaseSuccessCount();
      // the previous tracking window closed, and
      // nothing happened to open the breaker
      if (timestampNow >= this.getHalfBreakerTimeoutInMs()) {
        state = CircuitBreakerState.CLOSED;
        this.reset();
      }
    }
    // attempt after openBreakerTimeoutInMs successful,
    // it means that we should close the breaker
    if (currentState === CircuitBreakerState.OPENED) {
      state = CircuitBreakerState.CLOSED;
      this.reset();
    }
    this.setState(state);

    return response;
  }

  private fail(e: Error): Error {
    const currentState = this.getState();

    let state = currentState;
    // breaker opened and new attempt is failed
    if (currentState === CircuitBreakerState.OPENED) {
      const newTimestamp = Date.now() + this.options.openBreakerTimeoutInMs;

      this.setMinWaitingTimeInMs(newTimestamp);
    }

    // the first failed request comes in
    if (currentState === CircuitBreakerState.CLOSED) {
      const newTimestamp = Date.now() + this.options.halfBreakerTimeoutInMs;

      state = CircuitBreakerState.HALF;

      this.increaseFailCount();
      this.setHalfBreakerTimeoutInMs(newTimestamp);
    }

    if (currentState === CircuitBreakerState.HALF) {
      const timestampNow = Date.now();

      this.increaseFailCount();
      // it means that the previous tracking window closed
      // and nothing happened to open the breaker
      // but the new HALF state should be started immediately
      if (timestampNow > this.getHalfBreakerTimeoutInMs()) {
        this.reset();
        this.increaseFailCount();
      }

      // the tracking window isn't closed yet
      if (this.getFailCount() >= this.getMinFailedRequestThreshold()) {
        const failRate =
          (this.getFailCount() * 100) /
          (this.getFailCount() + this.getSuccessCount());

        // failed rate exceeds and breaker is opened
        if (failRate >= this.getPercentageFailedRequestsThreshold()) {
          const newTimestamp = Date.now() + this.options.openBreakerTimeoutInMs;

          state = CircuitBreakerState.OPENED;

          this.reset();
          this.setMinWaitingTimeInMs(newTimestamp);
        } else {
          // otherwise it's considered as normal state
          // but the new tracking window should be started
          this.reset();
          this.increaseFailCount();
        }
      }
    }

    this.setState(state);

    return e;
  }
}
