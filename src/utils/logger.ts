/**
 * Simple logger utility that respects environment settings
 * In production, Terser removes all console statements
 * In development, this provides structured logging with prefixes
 */

const isDevelopment = import.meta.env.DEV;
const VERBOSE_LOGGING = import.meta.env.VITE_VERBOSE_LOGGING === 'true';

/**
 * Development-only logging with structured prefixes
 * These logs will be stripped in production by Terser
 */
export const logger = {
  /**
   * General information logging
   */
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment && VERBOSE_LOGGING) {
      // eslint-disable-next-line no-console
      console.log(`ℹ️ ${message}`, ...args);
    }
  },

  /**
   * Success/completion logging
   */
  success: (message: string, ...args: unknown[]) => {
    if (isDevelopment && VERBOSE_LOGGING) {
      // eslint-disable-next-line no-console
      console.log(`✅ ${message}`, ...args);
    }
  },

  /**
   * Warning logging (shown even without verbose flag)
   */
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(`⚠️ ${message}`, ...args);
    }
  },

  /**
   * Error logging (always shown in development)
   */
  error: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.error(`❌ ${message}`, ...args);
    }
  },

  /**
   * Debug logging for detailed tracing
   */
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment && VERBOSE_LOGGING) {
      // eslint-disable-next-line no-console
      console.log(`🔍 ${message}`, ...args);
    }
  },
};

export default logger;
