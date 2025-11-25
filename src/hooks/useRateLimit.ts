import { useState, useCallback } from 'react';

interface RateLimitConfig {
    maxAttempts: number;
    windowMs: number;
    blockDurationMs?: number;
}

interface RateLimitResult {
    isRateLimited: boolean;
    remainingAttempts: number;
    resetTime: number | null;
    attempt: () => boolean;
    reset: () => void;
}

/**
 * Custom hook for client-side rate limiting
 * @param key - Unique key for this rate limit (e.g., 'contact-form')
 * @param config - Rate limit configuration
 * @returns Rate limit state and functions
 */
export const useRateLimit = (
    key: string,
    config: RateLimitConfig = {
        maxAttempts: 3,
        windowMs: 60000, // 1 minute
        blockDurationMs: 300000, // 5 minutes
    }
): RateLimitResult => {
    const storageKey = `rateLimit_${key}`;

    const getStoredData = useCallback(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error reading rate limit data:', error);
        }
        return { attempts: [], blockedUntil: null };
    }, [storageKey]);

    const [data, setData] = useState(getStoredData);

    const isRateLimited = useCallback(() => {
        const now = Date.now();
        const { attempts, blockedUntil } = getStoredData();

        // Check if currently blocked
        if (blockedUntil && now < blockedUntil) {
            return true;
        }

        // Filter attempts within the time window
        const recentAttempts = attempts.filter(
            (timestamp: number) => now - timestamp < config.windowMs
        );

        return recentAttempts.length >= config.maxAttempts;
    }, [getStoredData, config.windowMs, config.maxAttempts]);

    const getRemainingAttempts = useCallback(() => {
        const now = Date.now();
        const { attempts } = getStoredData();
        const recentAttempts = attempts.filter(
            (timestamp: number) => now - timestamp < config.windowMs
        );
        return Math.max(0, config.maxAttempts - recentAttempts.length);
    }, [getStoredData, config.windowMs, config.maxAttempts]);

    const getResetTime = useCallback(() => {
        const { attempts, blockedUntil } = getStoredData();

        if (blockedUntil) {
            return blockedUntil;
        }

        if (attempts.length > 0) {
            const oldestAttempt = Math.min(...attempts);
            return oldestAttempt + config.windowMs;
        }

        return null;
    }, [getStoredData, config.windowMs]);

    const attempt = useCallback(() => {
        const now = Date.now();
        const { attempts, blockedUntil } = getStoredData();

        // Check if blocked
        if (blockedUntil && now < blockedUntil) {
            return false;
        }

        // Filter recent attempts
        const recentAttempts = attempts.filter(
            (timestamp: number) => now - timestamp < config.windowMs
        );

        // Check if rate limited
        if (recentAttempts.length >= config.maxAttempts) {
            const newData = {
                attempts: recentAttempts,
                blockedUntil: now + (config.blockDurationMs || config.windowMs * 5),
            };
            localStorage.setItem(storageKey, JSON.stringify(newData));
            setData(newData);
            return false;
        }

        // Record attempt
        const newAttempts = [...recentAttempts, now];
        const newData = {
            attempts: newAttempts,
            blockedUntil: null,
        };
        localStorage.setItem(storageKey, JSON.stringify(newData));
        setData(newData);
        return true;
    }, [getStoredData, config, storageKey]);

    const reset = useCallback(() => {
        localStorage.removeItem(storageKey);
        setData({ attempts: [], blockedUntil: null });
    }, [storageKey]);

    return {
        isRateLimited: isRateLimited(),
        remainingAttempts: getRemainingAttempts(),
        resetTime: getResetTime(),
        attempt,
        reset,
    };
};
