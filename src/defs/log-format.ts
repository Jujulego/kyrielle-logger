import { Log } from './log.js';

// Types
export type LogFormat<L extends Log = Log> = (log: L) => string;
