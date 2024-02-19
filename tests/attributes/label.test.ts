import { describe, expect, it, vi } from 'vitest';

import { hasLabel, withLabel } from '@/src/attributes/label.js';
import { LogLevel } from '@/src/defs/log-level.js';
import { logger$ } from '@/src/logger.js';

// Tests
describe('hasLabel', () => {
  it('should return false', () => {
    expect(hasLabel({ level: LogLevel.info, message: 'message' }))
      .toBe(false);
  });

  it('should return true', () => {
    expect(hasLabel({ level: LogLevel.info, label: 'label', message: 'message' }))
      .toBe(true);
  });
});

describe('withLabel', () => {
  it('should inject label to each emitted logs', () => {
    const spy = vi.fn();

    const logger = logger$(withLabel('test'));
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      label: 'test',
      message: 'life is 42'
    });
  });

  it('should not inject label if one is already present', () => {
    const spy = vi.fn();

    const logger = logger$(
      withLabel('first'),
      withLabel('second')
    );
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      label: 'first',
      message: 'life is 42'
    });
  });

  it('should force inject "second" label', () => {
    const spy = vi.fn();

    const logger = logger$(
      withLabel('first'),
      withLabel('second', true)
    );
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      label: 'second',
      message: 'life is 42'
    });
  });
});
