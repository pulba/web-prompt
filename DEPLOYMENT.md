# Production Deployment Guide

## 1. Turso Database Setup
1. Create a new database in [Turso](https://turso.tech).
2. Run all migrations in order:
   ```bash
   turso db shell <db-name> < migrations/0001_create_users.sql
   # ... repeat for all 0009 files
   ```
3. Create an admin user manually (or via a script):
   ```sql
   INSERT INTO users (username, password_hash) VALUES ('admin', '<bcrypt-hash>');
   ```

## 2. Cloudflare Pages Deployment
1. Connect your GitHub repository to Cloudflare Pages.
2. Set the build settings:
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Add Environment Variables (see below).

## 3. Environment Variables
Set these in Cloudflare Pages Dashboard (Settings > Variables):
- `TURSO_DATABASE_URL`: Your Turso DB URL.
- `TURSO_AUTH_TOKEN`: Your Turso Auth Token.
- `TELEGRAM_BOT_TOKEN`: Token from @BotFather.
- `TELEGRAM_WEBHOOK_SECRET`: A random string for webhook security.
- `TELEGRAM_ALLOWED_CHAT_ID`: Your Telegram User ID (get it from @userinfobot).

## 4. Telegram Webhook Setup
Set the webhook URL using curl or a browser:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-domain.com/api/telegram/webhook", "secret_token": "<YOUR_WEBHOOK_SECRET>"}'
```

## 5. Production Checklist
- [ ] All migrations applied.
- [ ] Admin user created.
- [ ] Environment variables set.
- [ ] Webhook registered.
- [ ] Custom domain configured.
- [ ] SSL/TLS active (automatic on Cloudflare).
