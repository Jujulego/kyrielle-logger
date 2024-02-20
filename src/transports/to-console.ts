import { q$, qfun, qprop } from '@jujulego/quick-tag';
import { Observer, observer$ } from 'kyrielle';

import { Log, LogFormat, LogLevel } from '../defs/index.js';

/**
 * Default formatter for console transport
 */
export const consoleFormat = qfun<Log>`#?:${qprop('label')}[${q$}] ?#${qprop('message')}`;

/**
 * Prints logs to `console`.
 */
export function toConsole(): Observer<Log>;

/**
 * Prints logs to `console` using given format.
 * @param format
 */
export function toConsole<L extends Log>(format: LogFormat<L>): Observer<L>;

export function toConsole(format: LogFormat = consoleFormat): Observer<Log> {
  return observer$<Log>({
    next(log: Log) {
      const args: unknown[] = [format(log)];

      if (log.error) {
        args.push(log.error);
      }

      switch (log.level) {
        case LogLevel.error:
          console.error(...args);
          break;

        case LogLevel.warning:
          console.warn(...args);
          break;

        case LogLevel.info:
        case LogLevel.verbose:
          // eslint-disable-next-line no-console
          console.log(...args);
          break;

        case LogLevel.debug:
          // eslint-disable-next-line no-console
          console.debug(...args);
          break;
      }
    },
    error(err: unknown) {
      console.error('ERROR IN LOGGERS', err);
    }
  });
}
