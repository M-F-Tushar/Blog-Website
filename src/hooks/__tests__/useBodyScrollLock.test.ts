import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBodyScrollLock } from '../useBodyScrollLock';

describe('useBodyScrollLock', () => {
  beforeEach(() => {
    // Reset body styles
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('should lock body scroll when isLocked is true', () => {
    renderHook(() => useBodyScrollLock(true));

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should not lock body scroll when isLocked is false', () => {
    renderHook(() => useBodyScrollLock(false));

    expect(document.body.style.overflow).toBe('');
  });

  it('should restore original overflow on unmount', () => {
    document.body.style.overflow = 'auto';

    const { unmount } = renderHook(() => useBodyScrollLock(true));

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('auto');
  });

  it('should toggle lock state correctly', () => {
    const { rerender } = renderHook(({ locked }) => useBodyScrollLock(locked), {
      initialProps: { locked: false },
    });

    expect(document.body.style.overflow).toBe('');

    // Lock
    rerender({ locked: true });
    expect(document.body.style.overflow).toBe('hidden');

    // Unlock
    rerender({ locked: false });
    expect(document.body.style.overflow).toBe('');
  });
});
