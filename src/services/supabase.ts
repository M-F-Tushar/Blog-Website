/**
 * Re-export shim — maintains backward compatibility for existing imports.
 * All canonical code lives in src/supabase/client.ts, src/types/, and src/supabase/queries.ts.
 */

// Client
export { supabase, isSupabaseConfigured } from '../supabase/client';

// Database types
export type { Json, Database } from '../types/database';
export type {
  DatabasePost,
  DatabaseRecommendation,
  DatabaseSettings,
  DatabaseProject,
  DatabasePublication,
  DatabaseCVEducation,
  DatabaseCVExperience,
  DatabaseCVCertification,
  DatabasePageContent,
} from '../types/database';

// App types
export type { Project, Publication } from '../types/types';

// Converters
export {
  postToDatabase,
  postFromDatabase,
  recommendationToDatabase,
  recommendationFromDatabase,
  projectToDatabase,
  projectFromDatabase,
  publicationToDatabase,
  publicationFromDatabase,
} from '../types/converters';
