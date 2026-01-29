/**
 * Production-safe logging utility
 * Only logs in development mode, except for errors
 */
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]): void => {
    if (isDev) console.log(...args); // eslint-disable-line no-console
  },
  warn: (...args: unknown[]): void => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]): void => {
    console.error(...args); // eslint-disable-line no-console
  },
  debug: (...args: unknown[]): void => {
    if (isDev) console.debug(...args); // eslint-disable-line no-console
  },
  info: (...args: unknown[]): void => {
    if (isDev) console.info(...args);
  },
};
