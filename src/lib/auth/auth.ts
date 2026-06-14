import { getSession } from './session';
import { dbClient } from '@/lib/db';
import type { User } from '@/lib/db/types';
import type { AstroCookies } from 'astro';

export async function getCurrentUser(cookies: AstroCookies): Promise<User | null> {
  const userId = getSession(cookies);
  if (!userId) return null;

  const result = await dbClient.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [userId],
  });

  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as User;
}

export async function isAuthenticated(cookies: AstroCookies): Promise<boolean> {
  const user = await getCurrentUser(cookies);
  return !!user;
}
