import { Observer, observer$ } from 'kyrielle';

import { Log, LogLevel } from '../defs/index.js';

/**
 * Prints logs to NestJS `LoggerService`.
 */
export function toNestLogger(loggerService: NestLoggerService): Observer<Log> {
  return observer$<Log>({
    next(log: Log) {
      const args = [log.error?.stack, log.label];

      switch (log.level) {
        case LogLevel.error:
          loggerService.error(log.message, ...args);
          break;

        case LogLevel.warning:
          loggerService.warn(log.message, ...args);
          break;

        case LogLevel.info:
          loggerService.log(log.message, ...args);
          break;

        case LogLevel.verbose:
          loggerService.verbose?.(log.message, ...args);
          break;

        case LogLevel.debug:
          loggerService.debug?.(log.message, ...args);
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
