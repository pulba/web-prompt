import { createClient } from '@libsql/client';

// Helper to get env variables in different environments
const getEnv = (key: string): string | undefined => {
  return import.meta.env[key] || process.env[key];
};

const url = getEnv('TURSO_DATABASE_URL');
const authToken = getEnv('TURSO_AUTH_TOKEN');

if (!url) {
  // Don't throw immediately at top level to avoid crashing the whole app if only some routes need DB
  // but for this app, most do. We'll log a clear error.
  console.error('❌ TURSO_DATABASE_URL is missing!');
}

export const dbClient = createClient({
  url: url || '',
  authToken: authToken,
});
