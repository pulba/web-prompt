import { defineConfig, passthroughImageService } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://prompt-vault.pages.dev',
  output: 'server',
  adapter: cloudflare({
    runtime: { mode: 'local' },
    platformProxy: {
      enabled: true,
    },
    nodejsCompat: true,
    imageService: 'passthrough',
  }),
  image: {
    service: passthroughImageService(),
  },
  integrations: [sitemap()],
  devToolbar: {
    enabled: false
  },
});
