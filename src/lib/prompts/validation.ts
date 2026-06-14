import { z } from 'zod';

export const promptSchema = z.object({
  title: z.string().min(3, 'Title minimal 3 karakter').max(255),
  content: z.string().min(10, 'Content minimal 10 karakter'),
  category_id: z.number().nullable().optional(),
  source: z.string().max(255).nullable().optional(),
  favorite: z.union([z.literal(0), z.literal(1)]).default(0),
});

export type PromptInput = z.infer<typeof promptSchema>;
