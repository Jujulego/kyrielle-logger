import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { hasTimestamp, withTimestamp } from '@/src/attributes/timestamp.js';
import { LogLevel } from '@/src/defs/log-level.js';
import { logger$ } from '@/src/logger.js';

// Tests
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime('2023-09-26T00:00:00.000Z');
});

afterEach(() => {
  vi.useRealTimers();
});

describe('hasTimestamp', () => {
  it('should return false', () => {
    expect(hasTimestamp({ level: LogLevel.info, message: 'message' }))
      .toBe(false);
  });

  it('should return true', () => {
    expect(hasTimestamp({ level: LogLevel.info, timestamp: 'timestamp', message: 'message' }))
      .toBe(true);
  });
});

describe('withTimestamp', () => {
  it('should inject timestamp to each emitted logs', () => {
    const spy = vi.fn();

    const logger = logger$(withTimestamp());
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      timestamp: '2023-09-26T00:00:00.000Z',
      message: 'life is 42'
    });
  });

  it('should not inject timestamp to emitted logs if one is already present', () => {
    const spy = vi.fn();

    const logger = logger$(
      (log) => ({ ...log, timestamp: 'test' }),
      withTimestamp()
    );
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      timestamp: 'test',
      message: 'life is 42'
    });
  });
});
