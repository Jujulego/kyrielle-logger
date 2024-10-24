import { filter$, type Subscribable } from 'kyrielle';
import process from 'node:process';
import { hasLabel } from '../attributes/index.js';
import { type Log, LogLevel } from '../defs/index.js';

/**
 * Filters logs by label according to DEBUG environment variable.
 *
 * DEBUG should contain a comma separated list of labels. Logs with debug level will be filtered if their labels
 * are not in the DEBUG list. If DEBUG contains a wildcard '*' item, then no logs will be filtered.
 */
export function logDebugFilter$<L extends Log>(debug = process.env.DEBUG) {
  const filters = new Set(debug?.split(','));

  // Global wildcard
  if (filters.has('*')) {
    return filter$<Subscribable<L>>(() => true);
  }

  // Per label
  return filter$<Subscribable<L>>((log) => {
    if (log.level > LogLevel.debug || !hasLabel(log)) {
      return true;
    }

    return filters.has(log.label);
  });
}
