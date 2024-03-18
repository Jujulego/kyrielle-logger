import { observer$ } from 'kyrielle';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LogGateway } from '@/src/gateway.js';
import { type Logger, logger$ } from '@/src/logger.js';

// Setup
let gateway: LogGateway;
let logger: Logger;

beforeEach(() => {
  gateway = new LogGateway();
  logger = logger$();
});

// Tests
describe('LogGateway', () => {
  it('should pass log to connected transport', () => {
    const transport = observer$({});
    vi.spyOn(transport, 'next');

    gateway.connect('test', transport);

    logger.subscribe(gateway);
    logger.info('life is 42');

    expect(transport.next).toHaveBeenCalledWith(expect.objectContaining({
      message: 'life is 42'
    }));
  });

  it('should not pass log to disconnected transport', () => {
    const transport = observer$({});
    vi.spyOn(transport, 'next');

    gateway.connect('test', transport);
    gateway.disconnect('test');

    logger.subscribe(gateway);
    logger.info('life is 42');

    expect(transport.next).not.toHaveBeenCalled();
  });
});
