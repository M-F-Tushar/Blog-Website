import { z } from 'zod';

/**
 * Validation schemas for user inputs
 */

export const PostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  content: z.string().min(1, 'Content is required').max(100000, 'Content is too long'),
  excerpt: z.string().max(500, 'Excerpt must be 500 characters or less').optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z
    .array(z.string().max(50, 'Tag must be 50 characters or less'))
    .max(10, 'Maximum 10 tags allowed'),
  status: z.enum(['Draft', 'Published', 'Archived']),
  coverImage: z.union([z.string().url('Invalid URL'), z.literal('')]).optional(),
});

export const RecommendationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
  url: z.string().url('Invalid URL'),
  type: z.string().min(1, 'Type is required'),
  tags: z
    .array(z.string().max(50, 'Tag must be 50 characters or less'))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  imageUrl: z.union([z.string().url('Invalid URL'), z.literal('')]).optional(),
});

export type ValidatedPost = z.infer<typeof PostSchema>;
export type ValidatedRecommendation = z.infer<typeof RecommendationSchema>;
