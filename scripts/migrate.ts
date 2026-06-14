import { createClient } from '@libsql/client';
import fs from 'node:fs';
import path from 'node:path';

// Simple .env reader
const envContent = fs.readFileSync('.env', 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) env[key.trim()] = val.join('=').trim();
});

const client = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

const migrationsDir = './migrations';
const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

async function run() {
  console.log('🚀 Starting migrations...');
  
  for (const file of files) {
    console.log(`  📄 Running ${file}...`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    
    try {
      await client.executeMultiple(sql);
      console.log(`  ✅ ${file} completed.`);
    } catch (e: any) {
      console.error(`  ❌ Error in ${file}:`, e.message);
      process.exit(1);
    }
  }
  
  console.log('🎉 All migrations completed successfully!');
}

run();
