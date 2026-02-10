import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string().default('General'),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
    coverImage: z.string().optional(),
    status: z.enum(['Published', 'Draft']).default('Published'),
    author: z.string().optional(),
  }),
});

const publications = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    type: z.enum(['conference', 'journal', 'preprint', 'thesis', 'workshop']),
    abstract: z.string().optional(),
    doi: z.string().optional(),
    arxiv: z.string().optional(),
    pdf: z.string().url().optional(),
    code: z.string().url().optional(),
    slides: z.string().url().optional(),
    poster: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    github: z.string().optional(),
    demo: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    status: z.enum(['active', 'archived', 'experimental']).default('active'),
    image: z.string().optional(),
  }),
});

export const collections = { blog, publications, projects };
