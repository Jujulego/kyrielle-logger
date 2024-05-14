import { q$, qfun, qprop } from '@jujulego/quick-tag';
import { Observer, observer$ } from 'kyrielle';

import { Log, LogFormat, LogLevel } from '../defs/index.js';

/**
 * Default formatter for Nest Logger transport
 */
export const nestLoggerFormat = qfun<Log>`#?:${qprop('label')}(${q$}) ?#${qprop('message')}`;

/**
 * Prints logs to NestJS `LoggerService`.
 */
export function toNestLogger(loggerService: NestLoggerService): Observer<Log>;

/**
 * Prints logs to NestJS `LoggerService` using given format.
 */
export function toNestLogger<L extends Log>(loggerService: NestLoggerService, format: LogFormat<L>): Observer<L>;

export function toNestLogger(loggerService: NestLoggerService, format = nestLoggerFormat): Observer<Log> {
  return observer$<Log>({
    next(log: Log) {
      const args = [log.error].filter((item) => !!item);

      switch (log.level) {
        case LogLevel.error:
          loggerService.error(format(log), ...args);
          break;

        case LogLevel.warning:
          loggerService.warn(format(log), ...args);
          break;

        case LogLevel.info:
          loggerService.log(format(log), ...args);
          break;

        case LogLevel.verbose:
          loggerService.verbose?.(format(log), ...args);
          break;

        case LogLevel.debug:
          loggerService.debug?.(format(log), ...args);
          break;
      }
    },
    error(err: unknown) {
      loggerService.error('Error while logging', err);
    }
  });
}

export interface NestLoggerService {
  /**
   * Write a 'log' level log.
   */
  log(message: unknown, ...optionalParams: unknown[]): unknown;

  /**
   * Write an 'error' level log.
   */
  error(message: unknown, ...optionalParams: unknown[]): unknown;

  /**
   * Write a 'warn' level log.
   */
  warn(message: unknown, ...optionalParams: unknown[]): unknown;

  /**
   * Write a 'debug' level log.
   */
  debug?(message: unknown, ...optionalParams: unknown[]): unknown;

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: unknown, ...optionalParams: unknown[]): unknown;

  /**
   * Write a 'fatal' level log.
   */
  fatal?(message: unknown, ...optionalParams: unknown[]): unknown;

  /**
   * Set log levels.
   * @param levels log levels
   */
  setLogLevels?(levels: LogLevel[]): unknown;
}
