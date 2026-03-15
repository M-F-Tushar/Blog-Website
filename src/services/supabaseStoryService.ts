import { getSupabaseClient, supabase } from '../supabase/client';
import {
  storyChapterFromDatabase,
  storyChapterToDatabase,
  storyMilestoneFromDatabase,
  storyMilestoneToDatabase,
} from '../types/converters';
import type { Database } from '../types/database';
import type { StoryChapter, StoryMilestone } from '../types/types';

const CHAPTERS_TABLE = 'story_chapters' as const;
const MILESTONES_TABLE = 'story_milestones' as const;

export const getAllStoryChapters = async (): Promise<StoryChapter[]> => {
  const client = getSupabaseClient();
  const { data, error } = await client.from(CHAPTERS_TABLE).select('*').order('sort_order');
  if (error) throw error;
  return (data || []).map(storyChapterFromDatabase);
};

export const createStoryChapter = async (
  chapter: Omit<StoryChapter, 'id' | 'createdAt' | 'updatedAt'>
): Promise<StoryChapter> => {
  const client = getSupabaseClient();
  const payload: Database['public']['Tables']['story_chapters']['Insert'] =
    storyChapterToDatabase(chapter);
  const { data, error } = await client
    .from(CHAPTERS_TABLE)
    .insert(payload as never)
    .select()
    .single();
  if (error) throw error;
  return storyChapterFromDatabase(data);
};

export const updateStoryChapter = async (
  id: string,
  chapter: Partial<StoryChapter>
): Promise<void> => {
  const client = getSupabaseClient();
  const updateData: Database['public']['Tables']['story_chapters']['Update'] = {};
  if (chapter.title !== undefined) updateData.title = chapter.title;
  if (chapter.subtitle !== undefined) updateData.subtitle = chapter.subtitle || null;
  if (chapter.body !== undefined) updateData.body = chapter.body;
  if (chapter.periodLabel !== undefined) updateData.period_label = chapter.periodLabel || null;
  if (chapter.featuredMedia !== undefined) updateData.featured_media = chapter.featuredMedia || null;
  if (chapter.visible !== undefined) updateData.visible = chapter.visible;
  if (chapter.sortOrder !== undefined) updateData.sort_order = chapter.sortOrder;
  const { error } = await client.from(CHAPTERS_TABLE).update(updateData as never).eq('id', id);
  if (error) throw error;
};

export const deleteStoryChapter = async (id: string): Promise<void> => {
  const client = getSupabaseClient();
  const { error } = await client.from(CHAPTERS_TABLE).delete().eq('id', id);
  if (error) throw error;
};

export const getAllStoryMilestones = async (): Promise<StoryMilestone[]> => {
  const client = getSupabaseClient();
  const { data, error } = await client.from(MILESTONES_TABLE).select('*').order('sort_order');
  if (error) throw error;
  return (data || []).map(storyMilestoneFromDatabase);
};

export const createStoryMilestone = async (
  milestone: Omit<StoryMilestone, 'id' | 'createdAt' | 'updatedAt'>
): Promise<StoryMilestone> => {
  const client = getSupabaseClient();
  const payload: Database['public']['Tables']['story_milestones']['Insert'] =
    storyMilestoneToDatabase(milestone);
  const { data, error } = await client
    .from(MILESTONES_TABLE)
    .insert(payload as never)
    .select()
    .single();
  if (error) throw error;
  return storyMilestoneFromDatabase(data);
};

export const updateStoryMilestone = async (
  id: string,
  milestone: Partial<StoryMilestone>
): Promise<void> => {
  const client = getSupabaseClient();
  const updateData: Database['public']['Tables']['story_milestones']['Update'] = {};
  if (milestone.chapterId !== undefined) updateData.chapter_id = milestone.chapterId || null;
  if (milestone.title !== undefined) updateData.title = milestone.title;
  if (milestone.description !== undefined) updateData.description = milestone.description || null;
  if (milestone.periodLabel !== undefined) updateData.period_label = milestone.periodLabel || null;
  if (milestone.sortOrder !== undefined) updateData.sort_order = milestone.sortOrder;
  const { error } = await client.from(MILESTONES_TABLE).update(updateData as never).eq('id', id);
  if (error) throw error;
};

export const deleteStoryMilestone = async (id: string): Promise<void> => {
  const client = getSupabaseClient();
  const { error } = await client.from(MILESTONES_TABLE).delete().eq('id', id);
  if (error) throw error;
};

export const subscribeToStoryUpdates = (
  callback: (payload: { chapters: StoryChapter[]; milestones: StoryMilestone[] }) => void,
  onError?: (error: Error) => void
) => {
  if (!supabase) {
    onError?.(new Error('Supabase is not initialized'));
    return () => {};
  }

  const refresh = () =>
    Promise.all([getAllStoryChapters(), getAllStoryMilestones()])
      .then(([chapters, milestones]) => callback({ chapters, milestones }))
      .catch((error) => onError?.(error));

  refresh();

  const client = getSupabaseClient();
  const channel = client
    .channel('story-content-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: CHAPTERS_TABLE }, refresh)
    .on('postgres_changes', { event: '*', schema: 'public', table: MILESTONES_TABLE }, refresh)
    .subscribe();

  return () => client.removeChannel(channel);
};
