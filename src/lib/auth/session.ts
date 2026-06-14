import type { AstroCookies } from 'astro';

const SESSION_COOKIE_NAME = 'auth_session';

export function createSession(cookies: AstroCookies, userId: string) {
  cookies.set(SESSION_COOKIE_NAME, userId, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function destroySession(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

export function getSession(cookies: AstroCookies): string | undefined {
  return cookies.get(SESSION_COOKIE_NAME)?.value;
}

export function rotateSession(cookies: AstroCookies) {
  const userId = getSession(cookies);
  if (userId) {
    createSession(cookies, userId);
  }
}
