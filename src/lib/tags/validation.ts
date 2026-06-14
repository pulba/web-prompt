import { z } from 'zod';

export const tagSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
});

export type TagInput = z.infer<typeof tagSchema>;
