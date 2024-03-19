import { pipe$ } from 'kyrielle';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { hasDelay, logDelay$ } from '@/src/attributes/delay.js';
import { LogLevel } from '@/src/defs/log-level.js';
import { logger$ } from '@/src/logger.js';

// Setup
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// Tests
describe('hasDelay', () => {
  it('should return false', () => {
    expect(hasDelay({ level: LogLevel.info, message: 'message' }))
      .toBe(false);
  });

  it('should return true', () => {
    expect(hasDelay({ level: LogLevel.info, delay: 42, message: 'message' }))
      .toBe(true);
  });
});

describe('logDelay$', () => {
  it('should inject delay since previous log to each emitted logs', () => {
    const spy = vi.fn();
    const logger = logger$();

    vi.setSystemTime(0);
    pipe$(logger, logDelay$()).subscribe(spy);

    vi.setSystemTime(100);
    logger.info('life is 42');

    vi.setSystemTime(250);
    logger.warn('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      delay: 100,
      message: 'life is 42'
    });
    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.warning,
      delay: 150,
      message: 'life is 42'
    });
  });
});
