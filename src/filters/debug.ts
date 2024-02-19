import { filter$ } from 'kyrielle';
import process from 'node:process';

import { Log, LogLevel } from '../defs/index.js';
import { hasLabel } from '../attributes/index.js';

/**
 * Filters logs by label according to DEBUG environment variable.
 *
 * DEBUG should contain a comma separated list of labels. Logs with debug level will be filtered if their labels
 * are not in the DEBUG list. If DEBUG contains a wildcard '*' item, then no logs will be filtered.
 */
export function envDebugFilter(debug = process.env.DEBUG) {
  const filters = new Set(debug?.split(','));

  // Global wildcard
  if (filters.has('*')) {
    return filter$<Log>(() => true);
  }

  // Per label
  return filter$((log: Log) => {
    if (log.level > LogLevel.debug || !hasLabel(log)) {
      return true;
    }

    return filters.has(log.label);
  });
}