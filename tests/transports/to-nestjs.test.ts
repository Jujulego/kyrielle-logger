import { flow$ } from 'kyrielle';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { logger$ } from '@/src/logger.js';
import { NestLoggerService, toNestLogger } from '@/src/transports/to-nest-logger.js';

// Setup
const loggerService: NestLoggerService = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  verbose: vi.fn(),
  fatal: vi.fn(),
};

beforeEach(() => {
  vi.resetAllMocks();
});

// Tests
describe('toNestjs', () => {
  it('should print error log using console.error', () => {
    const logger = logger$();
    flow$(logger, toNestLogger(loggerService));
    logger.error('life');

    expect(loggerService.error).toHaveBeenCalledWith('life', undefined, undefined);
  });

  it('should print warning log using console.warn', () => {
    const logger = logger$();
    flow$(logger, toNestLogger(loggerService));
    logger.warning('life');

    expect(loggerService.warn).toHaveBeenCalledWith('life', undefined, undefined);
  });

  it('should print info log using console.log', () => {
    const logger = logger$();
    flow$(logger, toNestLogger(loggerService));
    logger.info('life');

    expect(loggerService.log).toHaveBeenCalledWith('life', undefined, undefined);
  });

  it('should print debug log using console.debug', () => {
    const logger = logger$();
    flow$(logger, toNestLogger(loggerService));
    logger.debug('life');

    expect(loggerService.debug).toHaveBeenCalledWith('life', undefined, undefined);
  });

  it('should print log in console including label', () => {
    const logger = logger$(
      (log) => ({ ...log, label: 'test' })
    );
    flow$(logger, toNestLogger(loggerService));
    logger.info('life');

    expect(loggerService.log).toHaveBeenCalledWith('life', undefined, 'test');
  });

  it('should print log and error in console', () => {
    const error = new Error('Failed !');
    const logger = logger$();
    flow$(logger, toNestLogger(loggerService));
    logger.info('life', error);

    expect(loggerService.log).toHaveBeenCalledWith('life', error.stack, undefined);
  });
});
