# Security Policy

## 1. Authentication
- **Password Hashing**: Uses `bcryptjs` with a salt round of 10.
- **Session Management**: Uses `HttpOnly`, `Secure`, and `SameSite=Lax` cookies to prevent XSS and CSRF.
- **Session Rotation**: Sessions are automatically refreshed on every admin request.
- **Session Expiration**: Sessions expire after 7 days of inactivity.

## 2. API Security
- **Telegram Webhook**: Protected by `X-Telegram-Bot-Api-Secret-Token` and `TELEGRAM_ALLOWED_CHAT_ID` validation.
- **Input Validation**: All inputs are validated using `Zod` schemas.
- **SQL Injection**: All database queries use parameterized statements via `@libsql/client`.

## 3. Infrastructure
- **Cloudflare Pages**: Provides DDoS protection and automatic SSL/TLS.
- **Environment Variables**: Secrets are never committed to version control; they are managed via Cloudflare Dashboard.

## 4. Rate Limiting
- **Login**: For production, it is highly recommended to enable **Cloudflare Rate Limiting** on the `/login` path.
- **Webhook**: Enable rate limiting on `/api/telegram/webhook` to prevent spam.

## 5. Security Checklist
- [ ] `HttpOnly` and `Secure` flags verified on cookies.
- [ ] `TELEGRAM_WEBHOOK_SECRET` is long and random.
- [ ] `TELEGRAM_ALLOWED_CHAT_ID` is strictly enforced.
- [ ] No `any` types in critical logic.
- [ ] All database queries are parameterized.
