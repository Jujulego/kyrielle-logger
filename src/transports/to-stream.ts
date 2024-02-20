import { q$, qarg, qerror, qfun, qprop } from '@jujulego/quick-tag';
import { Observer, observer$ } from 'kyrielle';
import os from 'node:os';

import { LogTimestamp } from '../attributes/index.js';
import { Log, LogFormat } from '../defs/index.js';
import { qLogLevel } from '../formats/index.js';

// Types
export type StreamLog = Log & Partial<LogTimestamp>;

/**
 * Default formatter for console transport
 */
export const streamFormat = qfun<StreamLog>`#?:${qprop('timestamp')}${q$} - ?#${qLogLevel(qarg<Log>())} - #?:${qprop('label')}[${q$}] ?#${qprop('message')}#?:${qerror(qprop<Log>('error'))}${os.EOL}${q$}?#`;

/**
 * Prints logs to
 * @param stream
 */
export function toStream(stream: NodeJS.WritableStream): Observer<StreamLog>;
export function toStream<L extends Log>(stream: NodeJS.WritableStream, format?: LogFormat<L>): Observer<L>;

export function toStream(stream: NodeJS.WritableStream, format: LogFormat = streamFormat): Observer<Log> {
  // Build transport
  return observer$<Log>({
    next(log) {
      stream.write(format(log) + os.EOL);
    },
    error(err: unknown) {
      console.error('ERROR IN LOGGERS', err);
    }
  });
}

// Alias
export function toStdout<L extends Log = Log>(format?: LogFormat<L>): Observer<L> {
  return toStream(process.stdout, format);
}

export function toStderr<L extends Log = Log>(format: LogFormat<L> = streamFormat): Observer<L> {
  return toStream(process.stderr, format);
}
