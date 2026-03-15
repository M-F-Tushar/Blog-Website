import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured } from '../supabase/client';
import {
  createStoryChapter,
  createStoryMilestone,
  deleteStoryChapter,
  deleteStoryMilestone,
  subscribeToStoryUpdates,
  updateStoryChapter,
  updateStoryMilestone,
} from '../services/supabaseStoryService';
import { FALLBACK_STORY_CHAPTERS, FALLBACK_STORY_MILESTONES } from '../data/fallback';
import type { StoryChapter, StoryMilestone } from '../types/types';

interface StoryContextType {
  chapters: StoryChapter[];
  milestones: StoryMilestone[];
  addChapter: (chapter: Omit<StoryChapter, 'id' | 'createdAt' | 'updatedAt'>) => Promise<StoryChapter>;
  updateChapter: (id: string, chapter: Partial<StoryChapter>) => Promise<void>;
  deleteChapter: (id: string) => Promise<void>;
  addMilestone: (
    milestone: Omit<StoryMilestone, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<StoryMilestone>;
  updateMilestone: (id: string, milestone: Partial<StoryMilestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useSupabase = isSupabaseConfigured();
  const [chapters, setChapters] = useState<StoryChapter[]>(useSupabase ? [] : FALLBACK_STORY_CHAPTERS);
  const [milestones, setMilestones] = useState<StoryMilestone[]>(useSupabase ? [] : FALLBACK_STORY_MILESTONES);
  const [loading, setLoading] = useState(useSupabase);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!useSupabase) return;
    const unsubscribe = subscribeToStoryUpdates(
      ({ chapters: nextChapters, milestones: nextMilestones }) => {
        setChapters(nextChapters);
        setMilestones(nextMilestones);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setChapters(FALLBACK_STORY_CHAPTERS);
        setMilestones(FALLBACK_STORY_MILESTONES);
        setLoading(false);
        setError(err.message);
      }
    );
    return unsubscribe;
  }, [useSupabase]);

  const addChapter = useCallback(async (chapter: Omit<StoryChapter, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await createStoryChapter(chapter);
    if (!useSupabase) setChapters((prev) => [...prev, created]);
    return created;
  }, [useSupabase]);

  const updateChapterHandler = useCallback(async (id: string, chapter: Partial<StoryChapter>) => {
    if (useSupabase) {
      await updateStoryChapter(id, chapter);
      return;
    }
    setChapters((prev) => prev.map((item) => (item.id === id ? { ...item, ...chapter } : item)));
  }, [useSupabase]);

  const deleteChapterHandler = useCallback(async (id: string) => {
    if (useSupabase) {
      await deleteStoryChapter(id);
      return;
    }
    setChapters((prev) => prev.filter((item) => item.id !== id));
    setMilestones((prev) => prev.filter((item) => item.chapterId !== id));
  }, [useSupabase]);

  const addMilestone = useCallback(async (milestone: Omit<StoryMilestone, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await createStoryMilestone(milestone);
    if (!useSupabase) setMilestones((prev) => [...prev, created]);
    return created;
  }, [useSupabase]);

  const updateMilestoneHandler = useCallback(async (id: string, milestone: Partial<StoryMilestone>) => {
    if (useSupabase) {
      await updateStoryMilestone(id, milestone);
      return;
    }
    setMilestones((prev) => prev.map((item) => (item.id === id ? { ...item, ...milestone } : item)));
  }, [useSupabase]);

  const deleteMilestoneHandler = useCallback(async (id: string) => {
    if (useSupabase) {
      await deleteStoryMilestone(id);
      return;
    }
    setMilestones((prev) => prev.filter((item) => item.id !== id));
  }, [useSupabase]);

  const value = useMemo(
    () => ({
      chapters,
      milestones,
      addChapter,
      updateChapter: updateChapterHandler,
      deleteChapter: deleteChapterHandler,
      addMilestone,
      updateMilestone: updateMilestoneHandler,
      deleteMilestone: deleteMilestoneHandler,
      loading,
      error,
    }),
    [
      chapters,
      milestones,
      addChapter,
      updateChapterHandler,
      deleteChapterHandler,
      addMilestone,
      updateMilestoneHandler,
      deleteMilestoneHandler,
      loading,
      error,
    ]
  );

  return React.createElement(StoryContext.Provider, { value }, children);
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) throw new Error('useStory must be used within StoryProvider');
  return context;
};
