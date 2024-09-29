import { describe, expect, it, vi } from 'vitest';
import type { Log } from '@/src/defs/log.js';
import { LogLevel } from '@/src/defs/log-level.js';
import { logger$ } from '@/src/logger.js';

// Tests
describe('Logger.child', () => {
  it('should emit log from both child and parent', () => {
    // Setup logger
    const loggerSpy = vi.fn();

    const logger = logger$();
    logger.subscribe(loggerSpy);

    // Setup child
    const childSpy = vi.fn();

    const child = logger.child();
    child.subscribe(childSpy);

    // Test
    child.log('info', 'test');

    expect(childSpy).toHaveBeenCalledWith({ level: LogLevel.info, message: 'test' });
    expect(childSpy).toHaveBeenCalledWith({ level: LogLevel.info, message: 'test' });
    expect(loggerSpy).toHaveBeenCalledWith({ level: LogLevel.info, message: 'test' });
  });

  it('should format log with both format functions', () => {
    // Setup logger
    const loggerFn = vi.fn((log: Log) => ({ ...log, logger: 'life' }));
    const loggerSpy = vi.fn();

    const logger = logger$(loggerFn);
    logger.subscribe(loggerSpy);

    // Setup child
    const childFn = vi.fn((log: Log) => ({ ...log, child: 42 }));
    const childSpy = vi.fn();

    const child = logger.child(childFn);
    child.subscribe(childSpy);

    child.log('info', 'test');

    expect(childSpy).toHaveBeenCalledWith({ level: LogLevel.info, message: 'test', child: 42 });
    expect(loggerSpy).toHaveBeenCalledWith({ level: LogLevel.info, message: 'test', child: 42, logger: 'life' });
  });
});

describe('Logger.log', () => {
  it('should emit log with given level and message', () => {
    const spy = vi.fn();

    const logger = logger$();
    logger.subscribe(spy);

    logger.log('info', 'test');

    expect(spy).toHaveBeenCalledWith({ level: LogLevel.info, message: 'test' });
  });

  it('should emit log with given level, message and error', () => {
    const spy = vi.fn();
    const error = new Error('Failed !');

    const logger = logger$();
    logger.subscribe(spy);

    logger.log('info', 'test', error);

    expect(spy).toHaveBeenCalledWith({ level: LogLevel.info, message: 'test', error });
  });

  it('should use given fn to format log', () => {
    const fn = vi.fn((log: Log) => ({ ...log, life: 42 }));
    const spy = vi.fn();

    const logger = logger$(fn);
    logger.subscribe(spy);

    logger.log('info', 'test');

    expect(fn).toHaveBeenCalledWith({ level: LogLevel.info, message: 'test' });
    expect(spy).toHaveBeenCalledWith({ level: LogLevel.info, message: 'test', life: 42 });
  });
});

describe.each(['debug', 'verbose', 'info', 'warning', 'error'] as const)('Logger.%s', (level) => {
  it(`should emit a ${level} log`, () => {
    const spy = vi.fn();

    const logger = logger$();
    logger.subscribe(spy);

    logger[level]('test');

    expect(spy).toHaveBeenCalledWith({ level: LogLevel[level], message: 'test' });
  });

  it(`should emit a ${level} formatted log`, () => {
    const spy = vi.fn();

    const logger = logger$();
    logger.subscribe(spy);

    logger[level]`life=${42}`;

    expect(spy).toHaveBeenCalledWith({ level: LogLevel[level], message: 'life=42' });
  });

  it(`should emit a ${level} log with an error`, () => {
    const spy = vi.fn();
    const error = new Error('Failed !');

    const logger = logger$();
    logger.subscribe(spy);

    logger[level]('test', error);

    expect(spy).toHaveBeenCalledWith({ level: LogLevel[level], message: 'test', error });
  });
});
