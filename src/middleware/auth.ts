import { defineMiddleware } from 'astro:middleware';
import { isAuthenticated } from '@/lib/auth/auth';
import { rotateSession } from '@/lib/auth/session';

export const onRequest = defineMiddleware(async (context, next) => {
  const isAdminPath = context.url.pathname.startsWith('/admin');
  
  if (isAdminPath) {
    const auth = await isAuthenticated(context.cookies);
    if (!auth) {
      return context.redirect('/login');
    }
    // Rotate session on every admin request to keep it fresh
    rotateSession(context.cookies);
  }

  return next();
});
