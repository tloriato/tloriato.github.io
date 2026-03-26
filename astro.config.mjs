import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tloriato.github.io',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'min-light',
    },
  },
});
