/**
 * Generates favicons, the web manifest and the default social share image
 * (og-default.png, 1200×630) for both apps into apps/<app>/public/.
 *
 * These are brand graphics (wordmark on contour lines), not photographs.
 * Re-run after changing the wordmark or colours:  npm run assets:brand
 * Uses the pre-installed Playwright Chromium for text rendering and sharp for PNGs.
 */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharp = require(require.resolve('sharp', { paths: [path.join(root, 'node_modules/astro')] }));

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Playwright is required for the share image: npm i -D playwright (or run where it is installed).');
  process.exit(1);
}

const forest = '#183c32';
const cream = '#f6f2e9';
const sage = '#a9ad8f';

// Favicon: three ridgelines on forest — no text, legible at 16px.
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${forest}"/>
  <path d="M8 30 C18 18 26 16 34 22 S50 26 56 20" fill="none" stroke="${sage}" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M8 40 C17 31 27 29 35 34 S49 37 56 31" fill="none" stroke="${cream}" stroke-opacity="0.75" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M8 50 C18 43 28 42 36 46 S49 48 56 43" fill="none" stroke="${cream}" stroke-width="3.2" stroke-linecap="round"/>
</svg>`;

const font = (p) => readFileSync(path.join(root, 'node_modules', p)).toString('base64');
const serif = font('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2');
const sans = font('@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2');

function ridges(seed, w, h, lines = 11) {
  let s = seed;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  let out = '';
  for (let i = 0; i < lines; i++) {
    const t = i / (lines - 1);
    const base = h * (0.4 + t * 0.7);
    const peaks = Array.from({ length: 2 }, () => ({ x: w * rand(), wd: w * (0.15 + rand() * 0.25), ht: h * (0.1 + rand() * 0.2) * (1 - t * 0.5) }));
    let d = '';
    for (let x = -10; x <= w + 10; x += 8) {
      const lift = peaks.reduce((a, p) => a + p.ht * Math.exp(-(((x - p.x) / p.wd) ** 2)), 0);
      d += `${x === -10 ? 'M' : 'L'}${x},${(base - lift).toFixed(1)}`;
    }
    d += `L${w + 10},${h + 10}L-10,${h + 10}Z`;
    out += `<path d="${d}" fill="${forest}" stroke="${sage}" stroke-opacity="${(0.3 + t * 0.6).toFixed(2)}" stroke-width="1.4"/>`;
  }
  return out;
}

const ogHtml = (descriptor, line) => `<!doctype html><html><head><style>
@font-face{font-family:C;src:url(data:font/woff2;base64,${serif}) format('woff2');font-weight:500}
@font-face{font-family:M;src:url(data:font/woff2;base64,${sans}) format('woff2');font-weight:200 800}
html,body{margin:0;width:1200px;height:630px;background:${forest};overflow:hidden}
svg{position:absolute;inset:0}
.t{position:absolute;left:80px;top:84px;color:${cream}}
.n{font-family:C;font-weight:500;font-size:112px;line-height:1;letter-spacing:.5px}
.d{font-family:M;font-weight:600;font-size:22px;letter-spacing:4px;margin-top:18px;color:#d9c9ae}
.l{font-family:M;font-weight:500;font-size:26px;margin-top:44px;color:${cream};max-width:640px;line-height:1.4}
</style></head><body>
<svg width="1200" height="630" viewBox="0 0 1200 630">${ridges(descriptor.length * 7919, 1200, 630)}</svg>
<div class="t"><div class="n">Glazebrooke</div><div class="d">${descriptor}</div><div class="l">${line}</div></div>
</body></html>`;

const apps = {
  main: { name: 'Glazebrooke Coffee Estate', short: 'Glazebrooke', descriptor: 'Coffee Estate', line: 'Estate-grown coffee from Yercaud, in the Shevaroy Hills of Tamil Nadu.' },
  shop: { name: 'Glazebrooke Coffee Shop', short: 'Glazebrooke Shop', descriptor: 'Coffee Shop', line: 'Estate coffee from Yercaud, Tamil Nadu.' },
};

const browser = await chromium.launch();
for (const [app, cfg] of Object.entries(apps)) {
  const pub = path.join(root, 'apps', app, 'public');
  mkdirSync(pub, { recursive: true });
  writeFileSync(path.join(pub, 'favicon.svg'), faviconSvg);
  await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toFile(path.join(pub, 'favicon-32.png'));
  await sharp(Buffer.from(faviconSvg.replace('rx="12"', 'rx="0"'))).resize(180, 180).png().toFile(path.join(pub, 'apple-touch-icon.png'));
  await sharp(Buffer.from(faviconSvg)).resize(192, 192).png().toFile(path.join(pub, 'icon-192.png'));
  await sharp(Buffer.from(faviconSvg)).resize(512, 512).png().toFile(path.join(pub, 'icon-512.png'));
  writeFileSync(
    path.join(pub, 'site.webmanifest'),
    JSON.stringify(
      {
        name: cfg.name,
        short_name: cfg.short,
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        theme_color: forest,
        background_color: cream,
        display: 'browser',
      },
      null,
      2,
    ) + '\n',
  );
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(ogHtml(cfg.descriptor, cfg.line));
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: 'png' });
  await sharp(png).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(pub, 'og-default.png'));
  await page.close();
  console.log(`✓ ${app}: favicons, manifest, og-default.png`);
}
await browser.close();
