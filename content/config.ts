import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['essay', 'project']),
    draft: z.boolean().optional().default(false),
    preview: z.string().optional(),
  }),
});

export const collections = { posts };
