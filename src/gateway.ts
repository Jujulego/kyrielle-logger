import { type Observer, observer$ } from 'kyrielle';

import type { Log } from './defs/index.js';

/**
 * Simplifies management of multiple log transports.
 * Allows to connect & disconnect multiple log transports using a simple key
 */
export class LogGateway<L extends Log = Log> implements Observer<L> {
  // Attributes
  private readonly _transports = new Map<string, Observer<L>>();

  // Methods
  /**
   * Connects transport to the gateway, associated with given key.
   */
  connect(key: string, transport: Partial<Observer<L>>): void {
    this._transports.set(key, observer$(transport));
  }

  /**
   * Disconnects transport from the gateway, using key given to connect.
   * Returns disconnected observer, if any.
   */
  disconnect(key: string): Observer<L> | undefined {
    const obs = this._transports.get(key);
    this._transports.delete(key);

    return obs;
  }

  /**
   * Completes all transports and disconnect them.
   */
  destroy() {
    this.complete();
  }

  /**
   * Pass down log to all connected transports
   */
  readonly next = (data: L) => {
    for (const transport of this._transports.values()) {
      transport.next(data);
    }
  };

  /**
   * Pass down error to all connected transports
   */
  readonly error = (err: unknown): void => {
    for (const transport of this._transports.values()) {
      transport.error(err);
    }
  };

  /**
   * Completes all transports and disconnect them.
   */
  readonly complete = (): void => {
    for (const transport of this._transports.values()) {
      transport.complete();
    }

    this._transports.clear();
  };
}
