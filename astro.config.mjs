// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Custom domain (set in GitHub → Settings → Pages). If it ever changes, update `site`
// here, `url` in src/data/profile.json, and the Sitemap line in public/robots.txt.
export default defineConfig({
  site: 'https://avirupbasu.com',
  integrations: [sitemap()],
  // The stylesheet is small; inlining it removes the only render-blocking request.
  build: { inlineStylesheets: 'always' },
});
