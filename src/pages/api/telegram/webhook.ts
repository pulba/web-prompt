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
    // ponytail: using standard Response.json()
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = telegramUpdateSchema.safeParse(body);

    if (!result.success) {
      // ponytail: using standard Response.json()
      return Response.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { message } = result.data;
    const allowedChatId = getEnv('TELEGRAM_ALLOWED_CHAT_ID');

    console.log('📩 Incoming message from:', message?.chat.id);
    console.log('🔐 Allowed Chat ID:', allowedChatId);

    if (!allowedChatId) {
      console.error('❌ TELEGRAM_ALLOWED_CHAT_ID is not set in environment');
      // ponytail: using standard Response.json()
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (message?.chat.id && message.chat.id.toString() !== allowedChatId) {
      // ponytail: using standard Response.json()
      return Response.json({ error: 'Unauthorized Chat ID' }, { status: 403 });
    }

    if (message?.text) {
      await telegramService.processMessage(message.chat.id, message.text);
    }

    // ponytail: using standard Response.json()
    return Response.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: message }, { status: 500 });
  }
};
