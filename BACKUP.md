# Backup & Disaster Recovery

## 1. Database Backup (Turso)
Turso automatically handles replication and high availability. However, manual backups are recommended:
- **Manual Export**:
  ```bash
  turso db shell <db-name> .dump > backup.sql
  ```
- **Frequency**: Weekly or before major migrations.

## 2. Code Backup
- Source code is backed up on GitHub/GitLab.
- Ensure all environment variable keys are documented (without values) in `.env.example`.

## 3. Disaster Recovery Plan
### Scenario: Database Corruption
1. Create a new Turso database.
2. Restore from the latest `.sql` dump.
3. Update `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in Cloudflare Pages.
4. Redeploy.

### Scenario: Cloudflare Account Lockout
1. Keep a local copy of the `dist` folder or the build script.
2. The site can be hosted on any provider supporting Node.js/Edge functions (Vercel, Netlify, etc.) with minimal configuration changes.

## 4. Backup Checklist
- [ ] Local backup of the latest stable database dump.
- [ ] Environment variables documented in a secure password manager.
- [ ] Access to Turso and Cloudflare accounts verified.
