/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TURSO_DATABASE_URL: string;
  readonly TURSO_AUTH_TOKEN: string;
  readonly TELEGRAM_BOT_TOKEN: string;
  readonly TELEGRAM_WEBHOOK_SECRET: string;
  readonly TELEGRAM_ALLOWED_CHAT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
