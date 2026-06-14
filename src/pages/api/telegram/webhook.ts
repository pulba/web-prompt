import type { APIRoute } from 'astro';
import { telegramUpdateSchema } from '@/lib/telegram/validation';
import { telegramService } from '@/lib/telegram/service';

export const POST: APIRoute = async ({ request }) => {
  const getEnv = (key: string): string | undefined => {
    return import.meta.env[key] || process.env[key];
  };

  const secretToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
  const expectedSecret = getEnv('TELEGRAM_WEBHOOK_SECRET');

  if (expectedSecret && secretToken !== expectedSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const result = telegramUpdateSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }

    const { message } = result.data;
    const allowedChatId = getEnv('TELEGRAM_ALLOWED_CHAT_ID');

    console.log('📩 Incoming message from:', message?.chat.id);
    console.log('🔐 Allowed Chat ID:', allowedChatId);

    if (!allowedChatId) {
      console.error('❌ TELEGRAM_ALLOWED_CHAT_ID is not set in environment');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    if (message?.chat.id && message.chat.id.toString() !== allowedChatId) {
      return new Response(JSON.stringify({ error: 'Unauthorized Chat ID' }), { status: 403 });
    }

    if (message?.text) {
      await telegramService.processMessage(message.chat.id, message.text);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), { status: 500 });
  }
};
