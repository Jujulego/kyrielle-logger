import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { pipe$, Source, source$ } from 'kyrielle';
import process from 'node:process';

import { LogLabel } from '@/src/attributes/label.js';
import { Log, LogLevel } from '@/src/defs/index.js';
import { envDebugFilter } from '@/src/filters/debug.js';

// Setup
let logger: Source<Log & Partial<LogLabel>>;

beforeEach(() => {
  logger = source$();
});

// Tests
describe('envDebugFilter', () => {
  describe('empty DEBUG', () => {
    let spy: Mock;

    beforeEach(() => {
      spy = vi.fn();

      pipe$(logger, envDebugFilter())
        .subscribe(spy);
    });

    it('should not filter labelled info logs', () => {
      const spy = vi.fn();

      pipe$(logger, envDebugFilter())
        .subscribe(spy);

      logger.next({ label: 'test', level: LogLevel.info, message: 'Test' });
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not filter unlabelled debug logs', () => {
      logger.next({ level: LogLevel.info, message: 'Test' });
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should filter labelled debug logs', () => {
      logger.next({ label: 'test', level: LogLevel.debug, message: 'Test' });
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('wildcard DEBUG', () => {
    let spy: Mock;

    beforeEach(() => {
      spy = vi.fn();

      process.env.DEBUG = '*';
      pipe$(logger, envDebugFilter())
        .subscribe(spy);
    });

    it('should not filter labelled info logs', () => {
      const spy = vi.fn();

      pipe$(logger, envDebugFilter())
        .subscribe(spy);

      logger.next({ label: 'test', level: LogLevel.info, message: 'Test' });
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not filter unlabelled debug logs', () => {
      logger.next({ level: LogLevel.info, message: 'Test' });
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not filter labelled debug logs', () => {
      logger.next({ label: 'test', level: LogLevel.debug, message: 'Test' });
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('list DEBUG', () => {
    let spy: Mock;

    beforeEach(() => {
      spy = vi.fn();

      process.env.DEBUG = 'toto,tata,tutu';
      pipe$(logger, envDebugFilter())
        .subscribe(spy);
    });

    it('should not filter labelled info logs', () => {
      const spy = vi.fn();

      pipe$(logger, envDebugFilter())
        .subscribe(spy);

      logger.next({ label: 'test', level: LogLevel.info, message: 'Test' });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not filter unlabelled debug logs', () => {
      logger.next({ level: LogLevel.info, message: 'Test' });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should filter some labelled debug logs', () => {
      logger.next({ label: 'test', level: LogLevel.debug, message: 'Test' });
      logger.next({ label: 'tata', level: LogLevel.debug, message: 'Test' });

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});