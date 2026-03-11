import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('should read existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('existing'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('existing');
  });

  it('should handle complex objects', () => {
    const testObject = { name: 'Test', count: 42, active: true };
    const { result } = renderHook(() => useLocalStorage('test-key', testObject));

    expect(result.current[0]).toEqual(testObject);

    act(() => {
      result.current[1]({ ...testObject, count: 100 });
    });

    expect(result.current[0].count).toBe(100);
  });

  it('should handle arrays', () => {
    const testArray = ['item1', 'item2', 'item3'];
    const { result } = renderHook(() => useLocalStorage<string[]>('test-key', []));

    act(() => {
      result.current[1](testArray);
    });

    expect(result.current[0]).toEqual(testArray);
    expect(result.current[0].length).toBe(3);
  });

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
  });

  it('should handle invalid JSON gracefully', () => {
    localStorage.setItem('test-key', 'invalid-json{');

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });
});
