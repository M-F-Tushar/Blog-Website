import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAllPosts } from '../supabasePostsService';
import { supabase } from '../../supabase/client';

// Mock the supabase client
vi.mock('../../supabase/client', () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  };
});

describe('supabasePostsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAllPosts', () => {
    it('should catch and log errors, then rethrow when Supabase throws an exception', async () => {
      // Arrange
      const mockError = new Error('Simulated network failure');

      // Mock the Supabase chain to throw an error
      const mockOrder = vi.fn().mockRejectedValue(mockError);
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      (supabase.from as any).mockReturnValue({ select: mockSelect });

      // Spy on console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      await expect(getAllPosts()).rejects.toThrow(mockError);

      // Verify console.error was called with the correct arguments
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error in getAllPosts:', mockError);

      consoleErrorSpy.mockRestore();
    });
  });
});
