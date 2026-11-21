// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { unlistedSlugs } from './src/data/products.ts';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');
const site = (env.PUBLIC_SHOP_URL || 'https://shop.glazebrookecoffee.com').replace(/\/+$/, '');

// Placeholder products are noindex, so they are kept out of the sitemap too.

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !unlistedSlugs.some((slug) => page.includes(`/products/${slug}/`)),
      changefreq: 'weekly',
    }),
  ],
  vite: {
    ssr: { noExternal: ['@glazebrooke/brand'] },
  },
});
