import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, KeyboardShortcut } from '../useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call action when key is pressed', () => {
    const mockAction = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        action: mockAction,
        description: 'Test shortcut',
      },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Simulate key press
    const event = new KeyboardEvent('keydown', { key: 'k' });
    window.dispatchEvent(event);

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should call action when key with modifier is pressed', () => {
    const mockAction = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        ctrlKey: true,
        action: mockAction,
        description: 'Test shortcut with Ctrl',
      },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Simulate Ctrl+K
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    });
    window.dispatchEvent(event);

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should not call action when modifier is not pressed', () => {
    const mockAction = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        ctrlKey: true,
        action: mockAction,
        description: 'Test shortcut with Ctrl',
      },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Simulate just K without Ctrl
    const event = new KeyboardEvent('keydown', { key: 'k' });
    window.dispatchEvent(event);

    expect(mockAction).not.toHaveBeenCalled();
  });

  it('should support multiple shortcuts', () => {
    const mockAction1 = vi.fn();
    const mockAction2 = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        action: mockAction1,
        description: 'First shortcut',
      },
      {
        key: 'j',
        action: mockAction2,
        description: 'Second shortcut',
      },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Simulate K press
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    expect(mockAction1).toHaveBeenCalledTimes(1);
    expect(mockAction2).not.toHaveBeenCalled();

    // Simulate J press
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'j' }));
    expect(mockAction1).toHaveBeenCalledTimes(1);
    expect(mockAction2).toHaveBeenCalledTimes(1);
  });

  it('should cleanup event listeners on unmount', () => {
    const mockAction = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        action: mockAction,
        description: 'Test shortcut',
      },
    ];

    const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts));

    // Verify it works before unmount
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    expect(mockAction).toHaveBeenCalledTimes(1);

    // Unmount
    unmount();

    // Should not trigger after unmount
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    expect(mockAction).toHaveBeenCalledTimes(1); // Still 1, not 2
  });
});
