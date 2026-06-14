import { z } from 'zod';

export const telegramUpdateSchema = z.object({
  update_id: z.number(),
  message: z.object({
    message_id: z.number(),
    text: z.string().optional(),
    chat: z.object({
      id: z.number(),
    }),
  }).optional(),
});

export type TelegramUpdate = z.infer<typeof telegramUpdateSchema>;

export interface ParsedTelegramMessage {
  title: string;
  content: string;
  category: string | null;
  tags: string[];
}
