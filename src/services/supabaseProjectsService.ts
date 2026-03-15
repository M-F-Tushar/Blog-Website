import { getSupabaseClient, supabase } from '../supabase/client';
import { projectToDatabase, projectFromDatabase } from '../types/converters';
import type { Project } from '../types/types';

const PROJECTS_TABLE = 'projects';

/**
 * Get all projects from Supabase
 */
export const getAllProjects = async (): Promise<Project[]> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }

    return (data || []).map(projectFromDatabase);
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * Get a single project by ID
 */
export const getProjectById = async (id: string): Promise<Project | null> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase.from(PROJECTS_TABLE).select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      console.error('Error fetching project:', error);
      throw error;
    }

    return data ? projectFromDatabase(data) : null;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

/**
 * Create a new project
 */
export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const dbProject = projectToDatabase(project);
    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .insert(dbProject as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }

    return projectFromDatabase(data);
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Update an existing project
 */
export const updateProject = async (id: string, project: Partial<Project>): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const updateData: any = {};

    if (project.title !== undefined) updateData.title = project.title;
    if (project.slug !== undefined) updateData.slug = project.slug;
    if (project.description !== undefined) updateData.description = project.description;
    if (project.longDescription !== undefined)
      updateData.long_description = project.longDescription || null;
    if (project.tags !== undefined) updateData.tags = project.tags;
    if (project.techStack !== undefined) updateData.tech_stack = project.techStack;
    if (project.imageUrl !== undefined) updateData.image_url = project.imageUrl || null;
    if (project.liveUrl !== undefined) updateData.live_url = project.liveUrl || null;
    if (project.githubUrl !== undefined) updateData.github_url = project.githubUrl || null;
    if (project.problem !== undefined) updateData.problem = project.problem || null;
    if (project.motivation !== undefined) updateData.motivation = project.motivation || null;
    if (project.approach !== undefined) updateData.approach = project.approach || null;
    if (project.architecture !== undefined) updateData.architecture = project.architecture || null;
    if (project.implementation !== undefined)
      updateData.implementation = project.implementation || null;
    if (project.challenges !== undefined) updateData.challenges = project.challenges || null;
    if (project.lessonsLearned !== undefined)
      updateData.lessons_learned = project.lessonsLearned || null;
    if (project.futureImprovements !== undefined)
      updateData.future_improvements = project.futureImprovements || null;
    if (project.sortOrder !== undefined) updateData.sort_order = project.sortOrder;
    if (project.isFeatured !== undefined) updateData.is_featured = project.isFeatured;
    if (project.status !== undefined) updateData.status = project.status;

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from(PROJECTS_TABLE)
      // @ts-expect-error - Supabase type inference issue with database types
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { error } = await supabase.from(PROJECTS_TABLE).delete().eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time projects updates
 */
export const subscribeToProjectsUpdates = (
  callback: (projects: Project[]) => void,
  onError?: (error: Error) => void
) => {
  if (!supabase) {
    if (onError) {
      onError(new Error('Supabase is not initialized'));
    }
    return () => {}; // Return empty unsubscribe function
  }

  // Initial fetch
  getAllProjects()
    .then(callback)
    .catch((error) => {
      if (onError) {
        onError(error);
      }
    });

  // Subscribe to changes
  const client = getSupabaseClient();
  const channel = client
    .channel('projects-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: PROJECTS_TABLE,
      },
      () => {
        // Refetch all projects when any change occurs
        getAllProjects()
          .then(callback)
          .catch((error) => {
            console.error('Error in projects subscription:', error);
            if (onError) {
              onError(error);
            }
          });
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    client.removeChannel(channel);
  };
};
