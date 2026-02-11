/**
 * Re-export shim — maintains backward compatibility.
 * All types now live in src/types/types.ts.
 */
export type {
  Category,
  Post,
  Recommendation,
  Comment,
  SiteSettings,
  Skill,
  TimelineItem,
  Achievement,
  NavLink,
  Project,
  Publication,
  PageContent,
  CVEducation,
  CVExperience,
  CVCertification,
} from '../types/types';
export { PostStatus, RecommendationType } from '../types/types';
