/**
 * Deployment settings read from PUBLIC_* environment variables.
 * Astro/Vite inline these at build time. The fallback to process.env lets
 * Node scripts (e.g. scripts/content-status.mjs) import this module too.
 */
const env: Record<string, string | undefined> =
  (import.meta as unknown as { env?: Record<string, string> }).env ??
  (globalThis as unknown as { process?: { env: Record<string, string> } }).process?.env ??
  {};

const clean = (v: string | undefined) => (v ?? '').trim();
const stripSlash = (url: string) => url.replace(/\/+$/, '');

export const MAIN_SITE_URL = stripSlash(clean(env.PUBLIC_MAIN_SITE_URL) || 'https://glazebrookecoffee.com');
export const SHOP_URL = stripSlash(clean(env.PUBLIC_SHOP_URL) || 'https://shop.glazebrookecoffee.com');

/** GA4 measurement ID (G-XXXXXXX). Empty = analytics code is not rendered at all. */
export const GA4_ID = clean(env.PUBLIC_GA4_ID);
/** Google Search Console HTML-tag verification token (content attribute only). */
export const GSC_VERIFICATION = clean(env.PUBLIC_GSC_VERIFICATION);

/** Hide "to be supplied" placeholder notes and photo captions (use for launch once content is in). */
export const HIDE_PLACEHOLDERS = clean(env.PUBLIC_HIDE_PLACEHOLDERS) === 'true';
/** Set to 'false' to strip every owner-supplied-but-unverified fact from the copy. */
export const PUBLISH_UNVERIFIED_FACTS = clean(env.PUBLIC_PUBLISH_UNVERIFIED_FACTS) !== 'false';
