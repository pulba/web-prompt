import { createClient } from '@libsql/client';
import fs from 'node:fs';
import path from 'node:path';

// ponytail: using native process.loadEnvFile() to avoid custom parsing
try {
  process.loadEnvFile();
} catch (e) {
  console.error('❌ .env file not found or failed to load!');
  process.exit(1);
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
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
