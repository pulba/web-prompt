import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const getEnv = (key: string): string | undefined => {
    return import.meta.env[key] || process.env[key];
  };

  const status = {
    TURSO_DATABASE_URL: !!getEnv('TURSO_DATABASE_URL'),
    TURSO_AUTH_TOKEN: !!getEnv('TURSO_AUTH_TOKEN'),
    TELEGRAM_BOT_TOKEN: !!getEnv('TELEGRAM_BOT_TOKEN'),
    TELEGRAM_ALLOWED_CHAT_ID: !!getEnv('TELEGRAM_ALLOWED_CHAT_ID'),
    TELEGRAM_WEBHOOK_SECRET: !!getEnv('TELEGRAM_WEBHOOK_SECRET'),
  };

  return new Response(JSON.stringify(status, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
