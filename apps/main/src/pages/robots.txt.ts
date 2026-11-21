import type { APIRoute } from 'astro';
import { SITE_INDEXABLE } from '@glazebrooke/brand/lib/env';

/**
 * robots.txt for this site's own domain: everything public is crawlable.
 * On preview deployments (PUBLIC_SITE_INDEXABLE=false) crawling is disallowed.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = SITE_INDEXABLE
    ? `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`
    : `# Preview deployment: not for search engines.\nUser-agent: *\nDisallow: /\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
