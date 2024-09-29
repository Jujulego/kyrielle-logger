import type { LogLevel } from './log-level.js';

// Interface
export interface Log {
  level: LogLevel;
  message: string;

  label?: string;
  error?: Error | undefined;
}
