import { defineQuickFormat } from '@jujulego/quick-tag';
import prettyMilliseconds, { Options } from 'pretty-ms';

import { WithDelay } from '../attributes/index.js';

/**
 * Injects log's delay, formatted using pretty-ms
 */
export const qLogDelay = defineQuickFormat((log: WithDelay, opts?: Options) => {
  return prettyMilliseconds(log.delay, opts);
});
