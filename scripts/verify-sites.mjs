/**
 * Post-build verification for both sites (run after `npm run build`):
 *   npm run verify
 *
 * Checks every built HTML page for: unique title and meta description,
 * canonical on the correct production domain, robots meta, one <h1>, lang,
 * Open Graph / Twitter tags, alt attributes on images, valid JSON-LD with no
 * ratings/reviews, resolvable internal and cross-site links, and that the
 * sitemap and robots.txt agree with the pages. Exits 1 on any error.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const strip = (u) => u.replace(/\/+$/, '');
const sites = {
  main: { dist: path.join(root, 'apps/main/dist'), origin: strip(process.env.PUBLIC_MAIN_SITE_URL || 'https://glazebrookecoffee.com') },
  shop: { dist: path.join(root, 'apps/shop/dist'), origin: strip(process.env.PUBLIC_SHOP_URL || 'https://shop.glazebrookecoffee.com') },
};
/** Preview builds (PUBLIC_SITE_INDEXABLE=false) must be fully noindex and disallowed instead. */
const previewBuild = process.env.PUBLIC_SITE_INDEXABLE === 'false';
/** Pages that are deliberately noindex. */
const allowedNoindex = [/^\/404\.html$/, /^\/products\/[^/]*placeholder[^/]*\/$/];

let errors = 0;
let warnings = 0;
const err = (site, page, msg) => {
  errors++;
  console.log(`  ✗ [${site}] ${page}: ${msg}`);
};
const warn = (site, page, msg) => {
  warnings++;
  console.log(`  ! [${site}] ${page}: ${msg}`);
};

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const toRoute = (dist, file) => {
  const rel = '/' + path.relative(dist, file).split(path.sep).join('/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
};

function resolves(dist, pathname) {
  const clean = decodeURIComponent(pathname.split('#')[0].split('?')[0]);
  const target = path.join(dist, clean);
  if (clean.endsWith('/')) return existsSync(path.join(target, 'index.html'));
  return existsSync(target) || existsSync(path.join(target, 'index.html'));
}

const pagesBySite = {};
for (const [name, site] of Object.entries(sites)) {
  if (!existsSync(site.dist)) {
    err(name, '-', `missing build output ${site.dist} — run npm run build first`);
    continue;
  }
  pagesBySite[name] = walk(site.dist)
    .filter((f) => f.endsWith('.html'))
    .map((file) => ({ file, route: toRoute(site.dist, file), doc: parse(readFileSync(file, 'utf8')) }));
}

for (const [name, site] of Object.entries(sites)) {
  const pages = pagesBySite[name];
  if (!pages) continue;
  console.log(`\n${name} (${site.origin}) — ${pages.length} pages`);
  const titles = new Map();
  const descs = new Map();
  const indexable = new Set();

  for (const { route, doc } of pages) {
    const meta = (sel) => doc.querySelector(sel)?.getAttribute('content');
    const title = doc.querySelector('title')?.text.trim();
    const desc = meta('meta[name="description"]');
    const robots = meta('meta[name="robots"]') || '';
    const noindex = robots.includes('noindex');
    const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');

    if (!title) err(name, route, 'missing <title>');
    else if (!noindex) titles.set(title, [...(titles.get(title) || []), route]);
    if (!desc) err(name, route, 'missing meta description');
    else {
      if (!noindex) descs.set(desc, [...(descs.get(desc) || []), route]);
      if (desc.length < 50 || desc.length > 170) warn(name, route, `meta description is ${desc.length} characters (aim for 50–160)`);
    }
    if (title && title.length > 75) warn(name, route, `title is ${title.length} characters (may be truncated in results)`);
    if (!doc.querySelector('html')?.getAttribute('lang')) err(name, route, 'missing html lang');

    if (previewBuild) {
      if (!noindex) err(name, route, 'preview build page is missing noindex');
      if (!allowedNoindex.some((re) => re.test(route))) indexable.add(route);
    } else if (noindex) {
      if (!allowedNoindex.some((re) => re.test(route))) err(name, route, 'unexpected noindex on a public page');
    } else {
      indexable.add(route);
      const expected = site.origin + route;
      if (canonical !== expected) err(name, route, `canonical ${canonical} ≠ ${expected}`);
    }

    const h1s = doc.querySelectorAll('h1').length;
    if (h1s !== 1) err(name, route, `${h1s} <h1> elements (expected 1)`);

    for (const tag of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) {
      if (!meta(`meta[property="${tag}"]`)) err(name, route, `missing ${tag}`);
    }
    const ogImage = meta('meta[property="og:image"]');
    if (ogImage && !ogImage.startsWith(site.origin)) err(name, route, `og:image not on ${site.origin}: ${ogImage}`);
    if (ogImage?.startsWith(site.origin) && !resolves(site.dist, new URL(ogImage).pathname)) err(name, route, `og:image file missing: ${ogImage}`);
    if (!meta('meta[name="twitter:card"]')) err(name, route, 'missing twitter:card');

    for (const img of doc.querySelectorAll('img')) {
      if (img.getAttribute('alt') === undefined) err(name, route, `<img src="${img.getAttribute('src')}"> has no alt attribute`);
    }

    for (const s of doc.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const json = JSON.parse(s.text);
        const flat = JSON.stringify(json);
        for (const banned of ['aggregateRating', 'Review', 'ratingValue']) {
          if (flat.includes(banned)) err(name, route, `structured data contains ${banned}`);
        }
        const nodes = json['@graph'] || [json];
        for (const n of nodes) {
          if (n['@type'] === 'Product') {
            for (const o of [].concat(n.offers || [])) {
              if (o.price === undefined || !o.priceCurrency) err(name, route, 'Offer without confirmed price/currency');
            }
          }
          for (const key of ['url', 'item', '@id']) {
            const v = n[key];
            if (typeof v === 'string' && v.startsWith('http') && !v.startsWith(sites.main.origin) && !v.startsWith(sites.shop.origin)) {
              err(name, route, `structured data ${key} on unexpected domain: ${v}`);
            }
          }
        }
      } catch (e) {
        err(name, route, `invalid JSON-LD: ${e.message}`);
      }
    }

    for (const a of doc.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
      if (href.startsWith('#')) {
        if (href.length > 1 && !doc.querySelector(`[id="${href.slice(1)}"]`)) err(name, route, `anchor ${href} has no target`);
        continue;
      }
      let url;
      try {
        url = new URL(href, site.origin + route);
      } catch {
        err(name, route, `unparseable link ${href}`);
        continue;
      }
      const target = Object.entries(sites).find(([, s]) => url.origin === s.origin);
      if (target) {
        if (!resolves(target[1].dist, url.pathname)) err(name, route, `broken link ${href}`);
        if (target[0] === name && href.startsWith('http')) warn(name, route, `same-site link uses absolute URL ${href}`);
      }
      if (a.getAttribute('target') === '_blank' && !(a.getAttribute('rel') || '').includes('noopener')) err(name, route, `target=_blank without noopener: ${href}`);
      if (!a.text.trim() && !a.getAttribute('aria-label') && a.getAttribute('aria-hidden') !== 'true' && !a.querySelector('img[alt]:not([alt=""])')) {
        err(name, route, `link without accessible text: ${href}`);
      }
    }
  }

  for (const [t, routes] of titles) if (routes.length > 1) err(name, routes.join(', '), `duplicate title "${t}"`);
  for (const [d, routes] of descs) if (routes.length > 1) err(name, routes.join(', '), `duplicate description "${d.slice(0, 60)}…"`);

  // Sitemap ↔ pages
  const smIndex = path.join(site.dist, 'sitemap-index.xml');
  if (!existsSync(smIndex)) err(name, '/sitemap-index.xml', 'missing');
  else {
    const smFiles = [...readFileSync(smIndex, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const locs = smFiles.flatMap((u) => {
      if (!u.startsWith(site.origin)) err(name, 'sitemap-index.xml', `sitemap on wrong domain: ${u}`);
      const f = path.join(site.dist, new URL(u).pathname);
      return existsSync(f) ? [...readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]) : [];
    });
    for (const loc of locs) {
      if (!loc.startsWith(site.origin + '/')) err(name, 'sitemap', `URL on wrong domain: ${loc}`);
      const route = new URL(loc).pathname;
      if (!indexable.has(route)) err(name, 'sitemap', `lists non-indexable or missing page ${route}`);
    }
    for (const route of indexable) if (!locs.includes(site.origin + route)) err(name, route, 'indexable page missing from sitemap');
    console.log(`  sitemap: ${locs.length} URLs`);
  }

  const robotsFile = path.join(site.dist, 'robots.txt');
  if (!existsSync(robotsFile)) err(name, '/robots.txt', 'missing');
  else {
    const robots = readFileSync(robotsFile, 'utf8');
    if (previewBuild) {
      if (!/^Disallow:\s*\/\s*$/m.test(robots)) err(name, '/robots.txt', 'preview build must disallow crawling');
    } else {
      if (/^Disallow:\s*\/\s*$/m.test(robots)) err(name, '/robots.txt', 'blocks the whole site');
      if (!robots.includes(`Sitemap: ${site.origin}/sitemap-index.xml`)) err(name, '/robots.txt', 'missing or wrong Sitemap line');
    }
  }
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
