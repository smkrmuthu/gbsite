/**
 * Lists everything the estate still needs to supply or confirm:
 *   npm run content:status
 * Reads the configuration files directly, so it is always current.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { brand } = await import(path.join(root, 'packages/brand/config/brand.config.ts'));
const { products } = await import(path.join(root, 'apps/shop/src/data/products.ts'));
const { photoSlots } = await import(path.join(root, 'packages/brand/config/photos.ts'));

const photoDir = path.join(root, 'packages/brand/photos');
const photos = new Set(
  existsSync(photoDir)
    ? readdirSync(photoDir)
        .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
        .map((f) => f.replace(/\.[^.]+$/, ''))
    : [],
);

const factsSrc = readFileSync(path.join(root, 'packages/brand/config/facts.ts'), 'utf8');
const unverifiedFacts = [...factsSrc.matchAll(/^\s{2}(\w+):\s*\{[^\n]*verified:\s*false/gm)].map((m) => m[1]);

const sections = [];
const add = (title, items) => items.length && sections.push({ title, items });

add('Contact details (packages/brand/config/brand.config.ts → contact)', [
  !brand.contact.email && 'Public enquiries email',
  !brand.contact.phone && 'Phone number',
  brand.contact.address.length === 0 && 'Postal address',
  !brand.contact.mapUrl && 'Map link',
  !brand.contact.formEndpoint && !brand.contact.email && 'Contact form route (email or formEndpoint) — the form is hidden until one is set',
].filter(Boolean));

add('Ordering (brand.config.ts → ordering)', [
  !brand.ordering.whatsappNumber && !brand.ordering.externalUrl && 'WhatsApp number or external ordering URL — Order buttons are hidden until one is set',
].filter(Boolean));

add('Social links (brand.config.ts → social)', brand.social.length ? [] : ['No official social profiles configured']);
add('Official logo (brand.config.ts → logoPath)', brand.logoPath ? [] : ['Typographic wordmark in use until the official logo is supplied']);
add('Unverified facts (packages/brand/config/facts.ts — set verified: true once confirmed)', unverifiedFacts);
add(
  'Products (apps/shop/src/data/products.ts)',
  products.filter((p) => p.status !== 'published').map((p) => `${p.slug}: placeholder — replace with a confirmed product`),
);
add(
  'Photographs (packages/brand/photos/<slot>.jpg)',
  [
    ...Object.keys(photoSlots).filter((k) => !photos.has(k)),
    ...products.map((p) => p.photo).filter((k) => !photos.has(k)),
  ].map((k) => `${k}.jpg — ${photoSlots[k]?.brief ?? 'product photograph'}`),
);
add('Deployment settings (environment variables)', [
  !process.env.PUBLIC_GA4_ID && 'PUBLIC_GA4_ID not set in this shell (analytics off) — set per site in the host if wanted',
  !process.env.PUBLIC_GSC_VERIFICATION && 'PUBLIC_GSC_VERIFICATION not set in this shell — or verify via DNS instead',
].filter(Boolean));

if (!sections.length) {
  console.log('Nothing outstanding. Consider setting PUBLIC_HIDE_PLACEHOLDERS=true for launch.');
} else {
  console.log('Content still needed from the estate\n');
  for (const s of sections) {
    console.log(`${s.title}`);
    for (const i of s.items) console.log(`  - ${i}`);
    console.log('');
  }
  console.log('Pages also contain "To be supplied by the estate" notes; search for <Pending in apps/*/src/pages.');
}
