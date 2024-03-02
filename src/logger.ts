import { qstr, QuickRenderArg } from '@jujulego/quick-tag';
import { Observable, Source, source$ } from 'kyrielle';

import { Log, LogLevel, LogLevelKey, LogModifier as LM, parseLogLevel } from './defs/index.js';

// Types
export type LeveledLogArgs = [message: string, error?: Error | undefined];
export type LeveledLogTagArgs = [strings: TemplateStringsArray, ...args: QuickRenderArg[]];

/**
 * Logger emitting logs, modifier using given modifier.
 * Provides utility methods to send raw logos, or logs formatted using quick tag.
 */
export class Logger<L extends Log = Log> implements Observable<L> {
  // Attributes
  private readonly _source = source$<L>();
  private readonly _modifier: LM<Log, L>;

  // Constructor
  constructor(modifier: LM<Log, L>) {
    this._modifier = modifier;

    this[Symbol.observable ?? '@@observable'] = () => this._source;
  }

  // Methods
  readonly [Symbol.observable]: () => Source<L>;
  readonly next = (log: Log) => this._source.next(this._modifier(log));

  readonly subscribe = this._source.subscribe;

  /**
   * Creates a child logger. Every log emitted by the children will be emitted by it's parent
   */
  child(): Logger;
  child<A extends Log>(fnA: LM<Log, A>): Logger<A>;
  child<A extends Log, B extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>): Logger<B>;
  child<A extends Log, B extends Log, C extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>): Logger<C>;
  child<A extends Log, B extends Log, C extends Log, D extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>, fnD: LM<C, D>): Logger<D>;
  child<A extends Log, B extends Log, C extends Log, D extends Log, E extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>, fnD: LM<C, D>, fnE: LM<D, E>): Logger<E>;
  child(...fns: LM[]): Logger;

  child(...fns: LM[]) {
    const child = logger$(...fns);
    child.subscribe(this.next);

    return child;
  }

  /**
   * Sends a log with a custom level
   */
  log(level: LogLevel | LogLevelKey, message: string, error?: Error): void {
    this.next({ level: parseLogLevel(level), message, error });
  }

  private _leveledLog(level: LogLevel, args: LeveledLogArgs | LeveledLogTagArgs): void {
    if (Array.isArray(args[0])) {
      const [strings, ...rest] = args as LeveledLogTagArgs;

      this.next({ level, message: qstr(strings, ...rest) });
    } else {
      const [message, error] = args as LeveledLogArgs;

      this.next({ level, message, error });
    }
  }

  /**
   * Logs a debug message
   */
  debug(message: string, error?: Error): void;
  debug(strings: TemplateStringsArray, ...args: QuickRenderArg[]): void;

  debug(...args: LeveledLogArgs | LeveledLogTagArgs): void {
    this._leveledLog(LogLevel.debug, args);
  }

  /**
   * Logs a verbose message
   */
  verbose(message: string, error?: Error): void;
  verbose(strings: TemplateStringsArray, ...args: QuickRenderArg[]): void;

  verbose(...args: LeveledLogArgs | LeveledLogTagArgs): void {
    this._leveledLog(LogLevel.verbose, args);
  }

  /**
   * Logs a info message
   */
  info(message: string, error?: Error): void;
  info(strings: TemplateStringsArray, ...args: QuickRenderArg[]): void;

  info(...args: LeveledLogArgs | LeveledLogTagArgs): void {
    this._leveledLog(LogLevel.info, args);
  }

  /**
   * Logs a warning message
   */
  warning(message: string, error?: Error): void;
  warning(strings: TemplateStringsArray, ...args: QuickRenderArg[]): void;

  warning(...args: LeveledLogArgs | LeveledLogTagArgs): void {
    this._leveledLog(LogLevel.warning, args);
  }

  warn = this.warning;

  /**
   * Logs a error message
   */
  error(message: string, error?: Error): void;
  error(strings: TemplateStringsArray, ...args: QuickRenderArg[]): void;

  error(...args: LeveledLogArgs | LeveledLogTagArgs): void {
    this._leveledLog(LogLevel.error, args);
  }
}

// Builder
/**
 * Builds a logger using given modifiers
 */
export function logger$(): Logger;
export function logger$<A extends Log>(fnA: LM<Log, A>): Logger<A>;
export function logger$<A extends Log, B extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>): Logger<B>;
export function logger$<A extends Log, B extends Log, C extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>): Logger<C>;
export function logger$<A extends Log, B extends Log, C extends Log, D extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>, fnD: LM<C, D>): Logger<D>;
export function logger$<A extends Log, B extends Log, C extends Log, D extends Log, E extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>, fnD: LM<C, D>, fnE: LM<D, E>): Logger<E>;
export function logger$(...fns: LM[]): Logger;

export function logger$(...fns: LM[]): Logger {
  return new Logger((log) => fns.reduce((acc, fn) => fn(acc), log));
}
