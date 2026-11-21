/**
 * Normalise a site-URL environment variable. Tolerates the common slips made
 * when typing it into a hosting dashboard: surrounding quotes or spaces, a
 * missing "https://", a trailing slash. Throws an error naming the variable
 * when the value still is not a valid http(s) URL.
 */
export function normaliseSiteUrl(name: string, raw: string | undefined, fallback: string): string {
  let value = (raw ?? '').trim().replace(/^["']+|["']+$/g, '').trim();
  if (!value) return fallback;
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} is not a valid URL: "${raw}". Use a full address such as https://shop.example.com`);
  }
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(`${name} must be just the site address with no path, e.g. ${url.origin} (got "${raw}")`);
  }
  return url.origin;
}
