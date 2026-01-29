/**
 * Production-safe logging utility
 * Only logs in development mode, except for errors
 */
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => isDev && console.log(...args),
  warn: (...args: unknown[]) => isDev && console.warn(...args),
  error: (...args: unknown[]) => console.error(...args),
  debug: (...args: unknown[]) => isDev && console.debug(...args),
  info: (...args: unknown[]) => isDev && console.info(...args),
};
