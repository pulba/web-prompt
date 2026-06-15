import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';

// Parse .env manually
const envPath = './.env';
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  }
});

const client = createClient({
  url: env.TURSO_DATABASE_URL || '',
  authToken: env.TURSO_AUTH_TOKEN || '',
});

async function main() {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'admin123';

  if (!env.TURSO_DATABASE_URL) {
    console.error('❌ TURSO_DATABASE_URL is not set in .env!');
    process.exit(1);
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Check if user exists
    const existing = await client.execute({
      sql: 'SELECT id FROM users WHERE username = ?',
      args: [username]
    });

    if (existing.rows.length > 0) {
      // Update password
      await client.execute({
        sql: 'UPDATE users SET password_hash = ? WHERE username = ?',
        args: [hash, username]
      });
      console.log(`✅ Password updated successfully for user: "${username}"`);
    } else {
      // Insert new user
      await client.execute({
        sql: 'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        args: [username, hash]
      });
      console.log(`✅ User "${username}" created successfully with password: "${password}"`);
    }
  } catch (err) {
    console.error('❌ Error creating/updating user:', err);
  } finally {
    client.close();
  }
}

main();
