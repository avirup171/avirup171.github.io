// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// When a custom domain is chosen, change `site` here and in public/robots.txt,
// then set the domain in GitHub → Settings → Pages.
export default defineConfig({
  site: 'https://avirup171.github.io',
  integrations: [sitemap()],
  // The stylesheet is small; inlining it removes the only render-blocking request.
  build: { inlineStylesheets: 'always' },
});
