import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const filePath = path.resolve('dist/server/wrangler.json');

try {
  const content = readFileSync(filePath, 'utf8');
  const config = JSON.parse(content);

  // Remove fields that conflict with Cloudflare Pages validation.
  // Pages projects cannot have "main" or "rules" — those are Worker-only fields.
  // "pages_build_output_dir" and "main" cannot coexist.
  delete config.main;
  delete config.rules;

  // Remove reserved bindings — Pages manages ASSETS internally,
  // and KV/Images bindings must be configured via the dashboard (with real IDs).
  delete config.assets;
  delete config.kv_namespaces;
  delete config.images;
  delete config.previews;

  // Remove fields that Wrangler doesn't recognize for Pages projects.
  delete config.definedEnvironments;
  delete config.ai_search_namespaces;
  delete config.ai_search;
  delete config.agent_memory;
  delete config.secrets_store_secrets;
  delete config.artifacts;
  delete config.unsafe_hello_world;
  delete config.flagship;
  delete config.worker_loaders;
  delete config.ratelimits;
  delete config.vpc_services;
  delete config.vpc_networks;
  delete config.python_modules;

  // Clean up dev-only fields not recognized by Pages.
  if (config.dev) {
    delete config.dev.enable_containers;
    delete config.dev.generate_types;
  }

  writeFileSync(filePath, JSON.stringify(config, null, 2));
  console.log('Successfully patched wrangler.json for Cloudflare Pages deployment.');
} catch (error) {
  console.error('Error patching wrangler.json:', error.message);
}
