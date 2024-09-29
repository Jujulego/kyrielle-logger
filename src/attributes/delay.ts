import { each$, type Subscribable } from 'kyrielle';
import type { Log } from '../defs/index.js';

// Types
export interface LogDelay {
  delay: number;
}

export type WithDelay<L extends Log = Log> = L & LogDelay;

/**
 * Tests if a log as a delay
 */
export function hasDelay<L extends Log>(log: L): log is WithDelay<L> {
  return 'delay' in log && typeof log.delay === 'number';
}

/**
 * Injects delay since previous emitted log
 */
export function logDelay$<L extends Log>() {
  let previous = Date.now();

  return each$<Subscribable<L>, WithDelay<L>>((log) => {
    const now = Date.now();
    const delay = now - previous;
    previous = now;

    return ({ ...log, delay });
  });
}
