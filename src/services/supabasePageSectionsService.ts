import { getSupabaseClient, supabase } from '../supabase/client';
import { pageSectionRecordFromDatabase, pageSectionRecordToDatabase } from '../types/converters';
import type { Database } from '../types/database';
import type { PageSectionRecord } from '../types/types';

const TABLE = 'page_sections' as const;

export const getAllPageSections = async (): Promise<PageSectionRecord[]> => {
  const client = getSupabaseClient();
  const { data, error } = await client.from(TABLE).select('*').order('page_key').order('sort_order');
  if (error) throw error;
  return (data || []).map(pageSectionRecordFromDatabase);
};

export const createPageSection = async (
  section: Omit<PageSectionRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<PageSectionRecord> => {
  const client = getSupabaseClient();
  const payload: Database['public']['Tables']['page_sections']['Insert'] =
    pageSectionRecordToDatabase(section);
  const { data, error } = await client
    .from(TABLE)
    .insert(payload as never)
    .select()
    .single();
  if (error) throw error;
  return pageSectionRecordFromDatabase(data);
};

export const updatePageSection = async (
  id: string,
  section: Partial<PageSectionRecord>
): Promise<void> => {
  const client = getSupabaseClient();
  const updateData: Database['public']['Tables']['page_sections']['Update'] = {};
  if (section.pageKey !== undefined) updateData.page_key = section.pageKey;
  if (section.sectionKey !== undefined) updateData.section_key = section.sectionKey;
  if (section.sectionType !== undefined) updateData.section_type = section.sectionType;
  if (section.presetKey !== undefined) updateData.preset_key = section.presetKey || null;
  if (section.eyebrow !== undefined) updateData.eyebrow = section.eyebrow || null;
  if (section.title !== undefined) updateData.title = section.title || null;
  if (section.subtitle !== undefined) updateData.subtitle = section.subtitle || null;
  if (section.body !== undefined) updateData.body = section.body || null;
  if (section.primaryCtaLabel !== undefined)
    updateData.primary_cta_label = section.primaryCtaLabel || null;
  if (section.primaryCtaUrl !== undefined) updateData.primary_cta_url = section.primaryCtaUrl || null;
  if (section.secondaryCtaLabel !== undefined)
    updateData.secondary_cta_label = section.secondaryCtaLabel || null;
  if (section.secondaryCtaUrl !== undefined)
    updateData.secondary_cta_url = section.secondaryCtaUrl || null;
  if (section.layoutVariant !== undefined) updateData.layout_variant = section.layoutVariant || null;
  if (section.visualTone !== undefined) updateData.visual_tone = section.visualTone || null;
  if (section.density !== undefined) updateData.density = section.density || null;
  if (section.backgroundTreatment !== undefined)
    updateData.background_treatment = section.backgroundTreatment || null;
  if (section.contentAlignment !== undefined)
    updateData.content_alignment = section.contentAlignment || null;
  if (section.mediaMode !== undefined) updateData.media_mode = section.mediaMode || null;
  if (section.contentCollection !== undefined)
    updateData.content_collection = section.contentCollection || null;
  if (section.contentSource !== undefined) updateData.content_source = section.contentSource || null;
  if (section.kickerStyle !== undefined) updateData.kicker_style = section.kickerStyle || null;
  if (section.sectionRole !== undefined) updateData.section_role = section.sectionRole || null;
  if (section.animationPreset !== undefined)
    updateData.animation_preset = section.animationPreset || null;
  if (section.contentGrouping !== undefined)
    updateData.content_grouping = section.contentGrouping || null;
  if (section.contentEmphasis !== undefined)
    updateData.content_emphasis = section.contentEmphasis || null;
  if (section.maxItems !== undefined) updateData.max_items = section.maxItems ?? null;
  if (section.showDivider !== undefined) updateData.show_divider = section.showDivider;
  if (section.featuredProjectId !== undefined)
    updateData.featured_project_id = section.featuredProjectId || null;
  if (section.featuredPostId !== undefined) updateData.featured_post_id = section.featuredPostId || null;
  if (section.featuredBookshelfEntryId !== undefined)
    updateData.featured_bookshelf_entry_id = section.featuredBookshelfEntryId || null;
  if (section.manualItemIds !== undefined) updateData.manual_item_ids = section.manualItemIds || [];
  if (section.metadata !== undefined) {
    updateData.metadata = (section.metadata || null) as Database['public']['Tables']['page_sections']['Row']['metadata'];
  }
  if (section.visible !== undefined) updateData.visible = section.visible;
  if (section.sortOrder !== undefined) updateData.sort_order = section.sortOrder;

  const { error } = await client.from(TABLE).update(updateData as never).eq('id', id);
  if (error) throw error;
};

export const deletePageSection = async (id: string): Promise<void> => {
  const client = getSupabaseClient();
  const { error } = await client.from(TABLE).delete().eq('id', id);
  if (error) throw error;
};

export const subscribeToPageSectionsUpdates = (
  callback: (sections: PageSectionRecord[]) => void,
  onError?: (error: Error) => void
) => {
  if (!supabase) {
    onError?.(new Error('Supabase is not initialized'));
    return () => {};
  }

  getAllPageSections().then(callback).catch((error) => onError?.(error));

  const client = getSupabaseClient();
  const channel = client
    .channel('page-sections-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, () => {
      getAllPageSections().then(callback).catch((error) => onError?.(error));
    })
    .subscribe();

  return () => client.removeChannel(channel);
};
