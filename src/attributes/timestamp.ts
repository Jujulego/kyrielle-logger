import type { Log, LogModifier } from '../defs/index.js';

// Types
export interface LogTimestamp {
  timestamp: string;
}

export type WithTimestamp<L extends Log = Log> = L & LogTimestamp;
export type WithTimestampModifier<L extends Log> = LogModifier<L, WithTimestamp<L>>;

/**
 * Tests if given log as a timestamp
 * @param log
 */
export function hasTimestamp<L extends Log>(log: L): log is WithTimestamp<L> {
  return 'timestamp' in log && typeof log.timestamp === 'string';
}

/**
 * Injects current timestamp in log record
 */
export function withTimestamp<L extends Log>(): WithTimestampModifier<L> {
  return (log: L) => ({ timestamp: new Date().toISOString(), ...log });
}
