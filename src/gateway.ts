import { type Observer } from 'kyrielle';

import type { Log } from './defs/index.js';

/**
 * Simplifies management of multiple log transports.
 * Allows to connect & disconnect multiple log transports using a simple key
 */
export class LogGateway<L extends Log = Log> implements Observer<L> {
  // Attributes
  private readonly _transports = new Map<string, Observer<L>>();

  // Methods
  connect(key: string, transport: Observer<L>): void {
    this._transports.set(key, transport);
  }

  disconnect(key: string): Observer<L> | undefined {
    return this._transports.get(key);
  }

  next(data: L) {
    for (const transport of this._transports.values()) {
      transport.next(data);
    }
  }

  error(err: unknown): void {
    for (const transport of this._transports.values()) {
      transport.error(err);
    }
  }

  complete(): void {
    for (const transport of this._transports.values()) {
      transport.complete();
    }
  }
}