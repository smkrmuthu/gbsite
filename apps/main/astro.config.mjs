// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');
const site = (env.PUBLIC_MAIN_SITE_URL || 'https://glazebrookecoffee.com').replace(/\/+$/, '');

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'monthly',
    }),
  ],
  vite: {
    ssr: { noExternal: ['@glazebrooke/brand'] },
  },
});
