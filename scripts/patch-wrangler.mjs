import { writeFileSync, unlinkSync, existsSync } from 'fs';
import path from 'path';

// 1. Delete the auto-generated wrangler.json that causes Cloudflare Pages
//    validation errors (main + pages_build_output_dir conflict).
const wranglerJsonPath = path.resolve('dist/server/wrangler.json');
if (existsSync(wranglerJsonPath)) {
  unlinkSync(wranglerJsonPath);
  console.log('Deleted dist/server/wrangler.json');
}

// 1b. Delete the deploy redirect config that points to the now-deleted wrangler.json.
//     Without this, Cloudflare's post-build step tries to follow the redirect and fails.
const deployConfigPath = path.resolve('.wrangler/deploy/config.json');
if (existsSync(deployConfigPath)) {
  unlinkSync(deployConfigPath);
  console.log('Deleted .wrangler/deploy/config.json');
}

// 2. Delete .dev.vars from build output (secrets must NOT be deployed).
const devVarsPath = path.resolve('dist/server/.dev.vars');
if (existsSync(devVarsPath)) {
  unlinkSync(devVarsPath);
  console.log('Deleted dist/server/.dev.vars');
}

// 3. Create _worker.js at the output root. This is the standard Cloudflare Pages
//    "Advanced Mode" approach — Pages automatically picks up _worker.js as the
//    Worker entry point, no wrangler.json needed.
const workerJs = `export { default } from "./server/entry.mjs";\n`;
writeFileSync(path.resolve('dist/_worker.js'), workerJs);
console.log('Created dist/_worker.js');

// 4. Create .assetsignore so the server directory and _worker.js are NOT
//    served as static assets to visitors.
const assetsIgnore = `_worker.js\nserver/\n`;
writeFileSync(path.resolve('dist/.assetsignore'), assetsIgnore);
console.log('Created dist/.assetsignore');

console.log('Post-build patch complete.');
