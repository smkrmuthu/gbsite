// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { normaliseSiteUrl } from '../../packages/brand/lib/site-url.ts';
import { unlistedSlugs } from './src/data/products.ts';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');
const site = normaliseSiteUrl('PUBLIC_SHOP_URL', env.PUBLIC_SHOP_URL, 'https://shop.glazebrookecoffee.com');

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
