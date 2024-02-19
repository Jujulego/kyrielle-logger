import { describe, expect, it, vi } from 'vitest';

import { hasPid, withPid } from '@/src/attributes/pid.js';
import { LogLevel } from '@/src/defs/log-level.js';
import { logger$ } from '@/src/logger.js';

// Tests
describe('hasPid', () => {
  it('should return false', () => {
    expect(hasPid({ level: LogLevel.info, message: 'message' }))
      .toBe(false);
  });

  it('should return true', () => {
    expect(hasPid({ level: LogLevel.info, pid: 42, message: 'message' }))
      .toBe(true);
  });
});

describe('withPid', () => {
  it('should inject pid to each emitted logs', () => {
    const spy = vi.fn();

    const logger = logger$(withPid());
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      pid: process.pid,
      message: 'life is 42'
    });
  });

  it('should not inject pid to emitted logs if one is already present', () => {
    const spy = vi.fn();

    const logger = logger$(
      (log) => ({ ...log, pid: -1 }),
      withPid()
    );
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      pid: -1,
      message: 'life is 42'
    });
  });
});
