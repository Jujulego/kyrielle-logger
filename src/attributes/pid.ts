import { Log, LogModifier } from '../defs/index.js';

// Types
export interface LogPid {
  pid: number;
}

export type WithPid<L extends Log = Log> = L & LogPid;
export type WithPidModifier<L extends Log> = LogModifier<L, WithPid<L>>;

/**
 * Tests if given log as a pid
 * @param log
 */
export function hasPid<L extends Log>(log: L): log is WithPid<L> {
  return 'pid' in log && typeof log.pid === 'number';
}

/**
 * Injects current process id into log
 */
export function withPid<L extends Log>(): WithPidModifier<L> {
  return (log: L) => ({ pid: process.pid, ...log });
}
