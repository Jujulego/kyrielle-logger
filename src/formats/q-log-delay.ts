import { defineQuickFormat } from '@jujulego/quick-tag';
import prettyMilliseconds, { type Options } from 'pretty-ms';
import type { WithDelay } from '../attributes/index.js';

/**
 * Injects log's delay, formatted using pretty-ms
 */
export const qLogDelay = defineQuickFormat((log: WithDelay, opts?: Options) => {
  return prettyMilliseconds(log.delay, opts);
});
