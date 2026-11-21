/**
 * Copies text and images from the previous Glazebrooke website for review.
 *
 *   npm run import:legacy                      # crawls https://glazebrookecoffee.com
 *   npm run import:legacy -- https://example.com --max-pages 80
 *
 * Run it from any machine that can reach the old site. Behind a corporate
 * proxy, prefix with NODE_USE_ENV_PROXY=1 (Node ≥ 22.21).
 *
 * Output (legacy-import/, for review — nothing is published automatically):
 *   raw/<slug>.html          original HTML of each page
 *   pages/<slug>.md          title, meta, and all visible text in order
 *   images/<file>            every image found, original size where possible
 *   images/inventory.json    {file, sourceUrl, pages, alt, context, bytes, contentType}
 *   SITE-FACTS.md            nav, contacts, social links, products (WooCommerce), image table
 *   REPORT.md                pages crawled, failures
 *
 * Next steps: confirm reuse rights for each image, then copy the chosen ones
 * into packages/brand/photos/ named after the photo slots (see IMAGE-ASSETS.md),
 * and move confirmed facts into packages/brand/config/*.ts.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const args = process.argv.slice(2);
const startUrl = new URL(args.find((a) => a.startsWith('http')) || 'https://glazebrookecoffee.com/');
const maxPages = Number(args[args.indexOf('--max-pages') + 1]) || 60;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'legacy-import');
for (const d of ['raw', 'pages', 'images']) mkdirSync(path.join(out, d), { recursive: true });

const UA = 'Mozilla/5.0 (compatible; GlazebrookeSiteImport/1.0)';
const hosts = new Set([startUrl.hostname, startUrl.hostname.replace(/^www\./, ''), `www.${startUrl.hostname.replace(/^www\./, '')}`]);
const skip = /\/(wp-admin|wp-login|feed|cart|checkout|my-account|wp-json)\b|[?&](add-to-cart|replytocom)=|\.(pdf|zip|xml|jpg|jpeg|png|gif|webp|svg|css|js)$/i;
const report = { pages: [], failures: [] };

async function get(url, as = 'text') {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return { body: as === 'text' ? await res.text() : Buffer.from(await res.arrayBuffer()), type: res.headers.get('content-type') || '', url: res.url };
}
const slugFor = (u) => (new URL(u).pathname.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-') || 'home').toLowerCase();
const norm = (u) => {
  const x = new URL(u);
  x.hash = '';
  x.search = '';
  return x.href;
};

// ---- Discover pages: sitemap(s) + link crawl ----
const queue = [norm(startUrl)];
for (const sm of ['/sitemap.xml', '/sitemap_index.xml', '/wp-sitemap.xml', '/page-sitemap.xml', '/product-sitemap.xml']) {
  try {
    const { body } = await get(new URL(sm, startUrl));
    for (const m of body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
      const loc = m[1];
      if (/\.xml$/.test(loc)) {
        try {
          const sub = await get(loc);
          for (const mm of sub.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) if (!/\.(xml|jpe?g|png|webp)$/i.test(mm[1])) queue.push(norm(mm[1]));
        } catch {}
      } else queue.push(norm(loc));
    }
  } catch {}
}

const seen = new Set();
const images = new Map(); // url -> {pages:Set, alt, context}
const facts = { emails: new Set(), phones: new Set(), whatsapp: new Set(), social: new Set(), nav: new Map(), titles: [] };
const addImage = (src, page, alt = '', context = '') => {
  if (!src || src.startsWith('data:')) return;
  let u;
  try {
    u = new URL(src, page).href;
  } catch {
    return;
  }
  const rec = images.get(u) || { pages: new Set(), alt, context };
  rec.pages.add(page);
  if (!rec.alt && alt) rec.alt = alt;
  if (!rec.context && context) rec.context = context;
  images.set(u, rec);
};
const largestFromSrcset = (srcset) =>
  srcset
    ?.split(',')
    .map((s) => s.trim().split(/\s+/))
    .sort((a, b) => parseInt(b[1] || '0') - parseInt(a[1] || '0'))[0]?.[0];

while (queue.length && seen.size < maxPages) {
  const url = queue.shift();
  if (seen.has(url) || skip.test(url) || !hosts.has(new URL(url).hostname)) continue;
  seen.add(url);
  let page;
  try {
    page = await get(url);
  } catch (e) {
    report.failures.push(`${url} — ${e.message}`);
    continue;
  }
  if (!page.type.includes('html')) continue;
  const slug = slugFor(url);
  writeFileSync(path.join(out, 'raw', `${slug}.html`), page.body);
  const doc = parse(page.body);
  const meta = (sel) => doc.querySelector(sel)?.getAttribute('content') || '';

  // Links
  for (const a of doc.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    try {
      const u = new URL(href, url);
      if (hosts.has(u.hostname)) queue.push(norm(u.href));
      if (/facebook|instagram|twitter|x\.com|youtube|linkedin|pinterest/i.test(u.hostname)) facts.social.add(u.href);
      if (/wa\.me|whatsapp/i.test(u.href)) facts.whatsapp.add(u.href);
      if (u.protocol === 'mailto:') facts.emails.add(u.pathname);
      if (u.protocol === 'tel:') facts.phones.add(decodeURIComponent(u.pathname));
    } catch {}
  }
  for (const nav of doc.querySelectorAll('nav, header, footer')) {
    for (const a of nav.querySelectorAll('a[href]')) {
      const t = a.text.replace(/\s+/g, ' ').trim();
      if (t) facts.nav.set(`${t} → ${a.getAttribute('href')}`, true);
    }
  }
  const textAll = doc.querySelector('body')?.text || '';
  for (const m of textAll.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)) facts.emails.add(m[0]);
  for (const m of textAll.matchAll(/(?:\+91[\s-]?)?(?:\d[\s-]?){10,12}/g)) if (m[0].replace(/\D/g, '').length >= 10) facts.phones.add(m[0].trim());

  // Images
  let lastHeading = '';
  for (const el of doc.querySelectorAll('h1, h2, h3, h4, img, [style*="background"], source')) {
    if (/^H\d$/.test(el.tagName)) {
      lastHeading = el.text.trim();
      continue;
    }
    if (el.tagName === 'IMG' || el.tagName === 'SOURCE') {
      const alt = el.getAttribute('alt') || '';
      for (const attr of ['src', 'data-src', 'data-lazy-src', 'data-orig-file', 'data-large-file']) addImage(el.getAttribute(attr), url, alt, lastHeading);
      for (const attr of ['srcset', 'data-srcset', 'data-lazy-srcset']) addImage(largestFromSrcset(el.getAttribute(attr)), url, alt, lastHeading);
    }
    const style = el.getAttribute('style') || '';
    for (const m of style.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)) addImage(m[1], url, '', lastHeading);
  }
  addImage(meta('meta[property="og:image"]'), url, 'og:image', 'Open Graph share image');
  for (const l of doc.querySelectorAll('link[rel*="icon"]')) addImage(l.getAttribute('href'), url, 'icon', 'favicon/touch icon');

  // Text → Markdown
  for (const n of doc.querySelectorAll('script, style, noscript, svg, iframe')) n.remove();
  const lines = [];
  const body = doc.querySelector('main') || doc.querySelector('#content') || doc.querySelector('body');
  for (const el of body?.querySelectorAll('h1, h2, h3, h4, h5, p, li, blockquote, figcaption, a.button, a.btn, .wp-block-button a, button') || []) {
    const t = el.text.replace(/\s+/g, ' ').trim();
    if (!t) continue;
    const tag = el.tagName;
    if (/^H\d$/.test(tag)) lines.push(`\n${'#'.repeat(Number(tag[1]))} ${t}\n`);
    else if (tag === 'LI') lines.push(`- ${t}`);
    else if (tag === 'BLOCKQUOTE') lines.push(`> ${t}`);
    else if (tag === 'A' || tag === 'BUTTON') lines.push(`[${t}](${el.getAttribute('href') || ''})`);
    else lines.push(`${t}\n`);
  }
  const title = doc.querySelector('title')?.text.trim() || '';
  facts.titles.push({ url, title, description: meta('meta[name="description"]') });
  const md = [
    `# ${title}`,
    '',
    `- URL: ${url}`,
    `- Meta description: ${meta('meta[name="description"]')}`,
    `- og:title: ${meta('meta[property="og:title"]')}`,
    `- og:description: ${meta('meta[property="og:description"]')}`,
    `- og:image: ${meta('meta[property="og:image"]')}`,
    `- Canonical: ${doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''}`,
    `- Generator: ${meta('meta[name="generator"]')}`,
    '',
    '---',
    '',
    ...[...new Set(lines)],
  ].join('\n');
  writeFileSync(path.join(out, 'pages', `${slug}.md`), md);
  report.pages.push(`${url} — ${title}`);
  process.stdout.write(`page ${seen.size}: ${url}\n`);
}

// ---- WordPress / WooCommerce public APIs (if present) ----
const api = {};
for (const [key, p] of Object.entries({
  pages: '/wp-json/wp/v2/pages?per_page=100',
  posts: '/wp-json/wp/v2/posts?per_page=100',
  media: '/wp-json/wp/v2/media?per_page=100',
  products: '/wp-json/wc/store/products?per_page=100',
})) {
  try {
    const { body } = await get(new URL(p, startUrl));
    api[key] = JSON.parse(body);
    writeFileSync(path.join(out, `wp-${key}.json`), JSON.stringify(api[key], null, 2));
  } catch {}
}
for (const m of api.media || []) addImage(m.source_url, 'wp-json media', m.alt_text || '', m.title?.rendered || '');
for (const p of api.products || []) for (const im of p.images || []) addImage(im.src, p.permalink, im.alt || p.name, `Product: ${p.name}`);

// ---- Download images (prefer WordPress originals over -WxH variants) ----
const inventory = [];
const hashes = new Set();
for (const [src, rec] of images) {
  const candidates = [];
  const orig = src.replace(/-\d+x\d+(\.\w+)(\?.*)?$/, '$1');
  if (orig !== src) candidates.push(orig);
  candidates.push(src);
  for (const c of candidates) {
    try {
      const { body, type } = await get(c, 'buffer');
      if (!type.startsWith('image/')) throw new Error(`not an image (${type})`);
      const hash = createHash('sha1').update(body).digest('hex');
      if (hashes.has(hash)) break;
      hashes.add(hash);
      let file = decodeURIComponent(new URL(c).pathname.split('/').pop() || 'image').replace(/[^\w.-]+/g, '-');
      if (inventory.some((i) => i.file === file)) file = `${hash.slice(0, 6)}-${file}`;
      writeFileSync(path.join(out, 'images', file), body);
      inventory.push({ file, sourceUrl: c, pages: [...rec.pages], alt: rec.alt, context: rec.context, bytes: body.length, contentType: type });
      break;
    } catch (e) {
      if (c === src) report.failures.push(`${src} — ${e.message}`);
    }
  }
}
writeFileSync(path.join(out, 'images', 'inventory.json'), JSON.stringify(inventory, null, 2));

// ---- Summaries ----
const list = (s) => ([...s].length ? [...s].map((x) => `- ${x}`).join('\n') : '- (none found)');
writeFileSync(
  path.join(out, 'SITE-FACTS.md'),
  `# Facts found on ${startUrl.origin} (unverified — confirm with the estate)

Imported ${new Date().toISOString()}.

## Navigation and footer links
${list(facts.nav.keys())}

## Emails
${list(facts.emails)}

## Phone numbers (pattern matches — check each)
${list(facts.phones)}

## WhatsApp links
${list(facts.whatsapp)}

## Social links
${list(facts.social)}

## Pages, titles and descriptions
${facts.titles.map((t) => `- ${t.url}\n  - Title: ${t.title}\n  - Description: ${t.description}`).join('\n')}

## Products (WooCommerce Store API)
${(api.products || []).map((p) => `- ${p.name} — ${p.permalink}\n  - Price: ${p.prices ? `${p.prices.currency_symbol}${(Number(p.prices.price) / 10 ** p.prices.currency_minor_unit).toFixed(p.prices.currency_minor_unit)}` : 'n/a'}\n  - Short description: ${(p.short_description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}`).join('\n') || '- (no public WooCommerce API found)'}

## Images
| File | Source | Alt | Context | KB |
| --- | --- | --- | --- | --- |
${inventory.map((i) => `| ${i.file} | ${i.sourceUrl} | ${i.alt.replace(/\|/g, '/')} | ${i.context.replace(/\|/g, '/')} | ${Math.round(i.bytes / 1024)} |`).join('\n')}

Facts in this file come from the old website and must still be confirmed before
they are used. Search the pages/*.md files for founding dates, elevation, varieties,
processing, certifications and similar claims.
`,
);
writeFileSync(
  path.join(out, 'REPORT.md'),
  `# Legacy import report

- Start URL: ${startUrl.href}
- Pages captured: ${report.pages.length}
- Images downloaded: ${inventory.length} (${(inventory.reduce((a, i) => a + i.bytes, 0) / 1048576).toFixed(1)} MB)

## Pages
${report.pages.map((p) => `- ${p}`).join('\n')}

## Failures
${report.failures.map((f) => `- ${f}`).join('\n') || '- none'}
`,
);
console.log(`\nDone: ${report.pages.length} pages, ${inventory.length} images → ${path.relative(root, out)}/`);
if (!report.pages.length) {
  console.log('No pages were captured. Check that the site is reachable from this machine.');
  process.exit(1);
}
