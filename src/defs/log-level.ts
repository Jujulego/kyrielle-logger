// Enum
export enum LogLevel {
  debug = 0,
  verbose = 1,
  info = 2,
  warning = 3,
  error = 4,
}

// Types
export type LogLevelKey = keyof typeof LogLevel;

// Utils
export function parseLogLevel(level: LogLevel | LogLevelKey): LogLevel {
  return typeof level === 'string' ? LogLevel[level] : level;
}
