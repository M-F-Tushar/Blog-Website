import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { isSupabaseConfigured } from '../supabase/client';
import {
  createProject as createProjectSupabase,
  updateProject as updateProjectSupabase,
  deleteProject as deleteProjectSupabase,
  subscribeToProjectsUpdates,
} from '../services/supabaseProjectsService';
import { FALLBACK_PROJECTS } from '../data/fallback';

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  github_url?: string;
  demo_url?: string;
  image_url?: string;
  tags: string[];
  status: 'active' | 'completed' | 'archived';
  featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

interface ProjectsContextType {
  projects: Project[];
  addProject: (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<Project>;
  updateProject: (
    projectId: string,
    projectData: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
  ) => Promise<Project | undefined>;
  deleteProject: (projectId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const getUserProjectsFromStorage = (): Project[] => {
  try {
    const savedUserProjects = window.localStorage.getItem('userProjects');
    return savedUserProjects ? JSON.parse(savedUserProjects) : [];
  } catch (error) {
    console.error('Error reading projects from localStorage', error);
    return [];
  }
};

const saveUserProjectsToStorage = (projects: Project[]) => {
  try {
    window.localStorage.setItem('userProjects', JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to localStorage', error);
  }
};

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useSupabase = isSupabaseConfigured();
  const [projects, setProjects] = useState<Project[]>(() => {
    if (!useSupabase) {
      const userProjects = getUserProjectsFromStorage();
      const initialProjects = FALLBACK_PROJECTS || [];
      return [...initialProjects, ...userProjects];
    }
    // If Supabase is configured, start empty and load via useEffect
    return [];
  });
  const [loading, setLoading] = useState(useSupabase); // Start as loading if using Supabase
  const [error, setError] = useState<string | null>(null);

  // Subscribe to Supabase updates if Supabase is configured
  useEffect(() => {
    if (!useSupabase) {
      // eslint-disable-next-line no-console
      console.log('Supabase not configured, using fallback projects data');
      return;
    }

    let mounted = true;

    const unsubscribe = subscribeToProjectsUpdates(
      (supabaseProjects) => {
        if (mounted) {
          setProjects(supabaseProjects);
          setLoading(false);
          setError(null);
        }
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error('Error loading projects from Supabase, falling back to local data:', err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
          // On error, fall back to fallback projects if none loaded
          setProjects((prev) => (prev.length === 0 ? FALLBACK_PROJECTS : prev));
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [useSupabase]);

  const addProject = useCallback(
    async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
      if (useSupabase) {
        try {
          const createdProject = await createProjectSupabase(projectData);
          // The subscription will update the state
          return createdProject;
        } catch (err) {
          console.error('Error creating project:', err);
          setError(err instanceof Error ? err.message : 'Failed to create project');
          throw err;
        }
      } else {
        // Fallback to localStorage
        const newProject: Project = {
          ...projectData,
          id: `${projectData.title
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-')
            .slice(0, 50)}-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const currentUserProjects = getUserProjectsFromStorage();
        const updatedUserProjects = [newProject, ...currentUserProjects];
        saveUserProjectsToStorage(updatedUserProjects);

        setProjects((prevProjects) => [newProject, ...prevProjects]);
        return newProject;
      }
    },
    [useSupabase]
  );

  const updateProject = useCallback(
    async (
      projectId: string,
      projectData: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<Project | undefined> => {
      if (useSupabase) {
        try {
          await updateProjectSupabase(projectId, projectData);
          // The subscription will update the state
          return projects.find((p) => p.id === projectId);
        } catch (err) {
          console.error('Error updating project:', err);
          setError(err instanceof Error ? err.message : 'Failed to update project');
          throw err;
        }
      } else {
        // Fallback to localStorage
        const currentUserProjects = getUserProjectsFromStorage();
        const projectIndex = currentUserProjects.findIndex((p) => p.id === projectId);

        if (projectIndex === -1) return undefined;

        const originalProject = currentUserProjects[projectIndex];
        const updatedProject: Project = {
          ...originalProject,
          ...projectData,
          updated_at: new Date().toISOString(),
        };

        currentUserProjects[projectIndex] = updatedProject;
        saveUserProjectsToStorage(currentUserProjects);

        setProjects((prevProjects) =>
          prevProjects.map((p) => (p.id === projectId ? updatedProject : p))
        );
        return updatedProject;
      }
    },
    [useSupabase, projects]
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      if (useSupabase) {
        try {
          await deleteProjectSupabase(projectId);
          // The subscription will update the state
        } catch (err) {
          console.error('Error deleting project:', err);
          setError(err instanceof Error ? err.message : 'Failed to delete project');
          throw err;
        }
      } else {
        // Fallback to localStorage
        const currentUserProjects = getUserProjectsFromStorage();
        const updatedUserProjects = currentUserProjects.filter((p) => p.id !== projectId);
        saveUserProjectsToStorage(updatedUserProjects);
        setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
      }
    },
    [useSupabase]
  );

  const value = useMemo(
    () => ({
      projects,
      addProject,
      updateProject,
      deleteProject,
      loading,
      error,
    }),
    [projects, addProject, updateProject, deleteProject, loading, error]
  );

  return React.createElement(ProjectsContext.Provider, { value }, children);
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
