import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const filePath = path.resolve('dist/server/wrangler.json');

try {
  const content = readFileSync(filePath, 'utf8');
  const config = JSON.parse(content);

  // Clean up bindings and assets that conflict with Cloudflare Pages validation.
  // These bindings are managed through Cloudflare Pages dashboard, so they
  // must be stripped from wrangler.json to prevent deployment validation errors.
  delete config.assets;
  delete config.kv_namespaces;
  delete config.images;
  if (config.previews) {
    delete config.previews;
  }

  writeFileSync(filePath, JSON.stringify(config, null, 2));
  console.log('Successfully patched wrangler.json for Cloudflare Pages deployment.');
} catch (error) {
  console.error('Error patching wrangler.json:', error.message);
}
