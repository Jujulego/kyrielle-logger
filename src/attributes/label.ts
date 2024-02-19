import { Log, LogModifier } from '../defs/index.js';

// Types
export interface LogLabel {
  label: string;
}

export type WithLabel<L extends Log = Log> = L & LogLabel;
export type WithLabelModifier<L extends Log> = LogModifier<L, WithLabel<L>>;

/**
 * Tests if given log as a label
 * @param log
 */
export function hasLabel<L extends Log>(log: L): log is WithLabel<L> {
  return typeof log.label === 'string';
}

/**
 * Injects given label in log record
 *
 * @param label Label to inject
 * @param force If false label won't be injected if log already has one
 */
export function withLabel<L extends Log>(label: string, force = false): WithLabelModifier<L> {
  return (log: L) => force ? { ...log, label } : { label, ...log };
}
