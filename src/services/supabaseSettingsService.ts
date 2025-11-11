import { supabase } from './supabase';

const SETTINGS_TABLE = 'settings';

export interface AppSettings {
  featuredPostId: string | null;
  siteTitle?: string;
  siteDescription?: string;
}

/**
 * Get app settings from Supabase
 */
export const getSettings = async (): Promise<AppSettings> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .select('*')
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found, return defaults
        return {
          featuredPostId: null,
        };
      }
      console.error('Error fetching settings:', error);
      throw error;
    }

    if (!data) {
      return {
        featuredPostId: null,
      };
    }

    return {
      featuredPostId: (data as any).featured_post_id,
      siteTitle: (data as any).site_title,
      siteDescription: (data as any).site_description,
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

/**
 * Update featured post ID
 */
export const setFeaturedPostId = async (postId: string | null): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    // Try to get existing settings
    const { data: existingData, error: fetchError } = await supabase
      .from(SETTINGS_TABLE)
      .select('id')
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching settings:', fetchError);
      throw fetchError;
    }

    if (existingData) {
      // Update existing settings
      const { error } = await supabase
        .from(SETTINGS_TABLE)
        // @ts-expect-error - Supabase type inference issue with database types
        .update({ featured_post_id: postId })
        .eq('id', (existingData as any).id);

      if (error) {
        console.error('Error updating featured post:', error);
        throw error;
      }
    } else {
      // Create new settings record
      const { error } = await supabase
        .from(SETTINGS_TABLE)
        .insert({
          featured_post_id: postId,
          site_title: 'My Blog',
          site_description: 'A personal blog',
        } as any);

      if (error) {
        console.error('Error creating settings:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error updating featured post:', error);
    throw error;
  }
};

/**
 * Subscribe to settings updates
 */
export const subscribeToSettingsUpdates = (
  callback: (settings: AppSettings) => void,
  onError?: (error: Error) => void
) => {
  if (!supabase) {
    if (onError) {
      onError(new Error('Supabase is not initialized'));
    }
    return () => {};
  }

  // Initial fetch
  getSettings()
    .then(callback)
    .catch((error) => {
      if (onError) {
        onError(error);
      }
    });

  // Subscribe to changes
  const channel = supabase
    .channel('settings-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: SETTINGS_TABLE,
      },
      () => {
        // Refetch settings when any change occurs
        getSettings()
          .then(callback)
          .catch((error) => {
            console.error('Error in settings subscription:', error);
            if (onError) {
              onError(error);
            }
          });
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};
