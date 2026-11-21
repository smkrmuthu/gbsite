// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { normaliseSiteUrl } from '../../packages/brand/lib/site-url.ts';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');
const site = normaliseSiteUrl('PUBLIC_MAIN_SITE_URL', env.PUBLIC_MAIN_SITE_URL, 'https://glazebrookecoffee.com');

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
