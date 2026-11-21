# Glazebrooke Coffee Estate: websites

Glazebrooke Coffee Estate is a coffee estate in Yercaud, in the Shevaroy Hills of
Tamil Nadu, India. This repository holds its two websites:

| Site | Domain | Purpose |
| --- | --- | --- |
| **Brand site** (`apps/main`) | `https://glazebrookecoffee.com` | Estate story, heritage, coffee, sustainability, people, contact |
| **Coffee shop** (`apps/shop`) | `https://shop.glazebrookecoffee.com` | Static product catalogue with clear ordering links (WhatsApp or an external ordering page) |

Both are static sites. They deploy independently but share one design system and
one configuration file, so a phone number or brand colour changes in one place.

> **Status (November 2026):** the design, pages, SEO, accessibility and tooling
> are built and verified. The official logo, 10 photographs and 5 product images
> supplied from the previous website are in place (see `IMAGE-ASSETS.md`).
> Text, contact details, prices and several facts are still to come from the
> estate. Missing items appear on the pages as clearly marked "To be supplied by
> the estate" notes. See
> [Content still needed from the estate](#content-still-needed-from-the-estate).

---

## Architecture

```
glazebrooke-web (npm workspaces)
├── apps/main     → Astro static site → apps/main/dist  → glazebrookecoffee.com
├── apps/shop     → Astro static site → apps/shop/dist  → shop.glazebrookecoffee.com
└── packages/brand  (shared, not deployed on its own)
    ├── config/   brand.config.ts (contact, ordering, social), facts.ts, photos.ts
    ├── lib/      env (domains, analytics), links (shop/order URLs), seo (JSON-LD), photos
    ├── styles/   tokens.css (palette, type, spacing), base.css
    └── components/  SiteLayout, Header, Footer, BaseHead (SEO), Analytics (consent + GA4),
                     Photo, ContourArt, ElevationDiagram, ContactForm, ContactDetails,
                     Pending, Breadcrumbs, PrivacyContent, Wordmark
```

- The brand site's **Buy coffee** buttons go to the shop URL (`PUBLIC_SHOP_URL`),
  in the same tab.
- The shop's **Order** buttons use the ordering route in `brand.config.ts`, in
  this order: external ordering URL, then WhatsApp, then email. Each button says
  in plain words what happens when it is clicked. With no route configured, the
  button is replaced by a note.
- There is no payment, cart, inventory or account system (Phase 1 by design).
  The product model in `apps/shop/src/data/products.ts` mirrors Shopify and
  WooCommerce product/variant shapes so it can be wired to either later.

## Technology

| | |
| --- | --- |
| Framework | [Astro](https://astro.build) 7.4 (static output, zero client JS by default) |
| Language | TypeScript (strict), `.astro` components, plain CSS with custom properties |
| Images | `astro:assets` + sharp → AVIF / WebP / JPEG at responsive widths, lazy-loaded below the fold |
| Fonts | Cormorant Garamond (display) and Manrope (text), self-hosted via Fontsource (SIL Open Font License) |
| SEO | `@astrojs/sitemap`, per-site `robots.txt`, canonical/OG/Twitter tags, JSON-LD |
| Tooling | `astro check`, `scripts/verify-sites.mjs` (SEO/link/sitemap checks), Lighthouse (manual) |
| Client JS | Only three small scripts: mobile menu, contact-form validation, analytics consent |

## Folder structure

```
.
├── apps/
│   ├── main/
│   │   ├── astro.config.mjs          site URL, sitemap
│   │   ├── public/                   favicons, og-default.png, _headers, _redirects, manifest
│   │   └── src/
│   │       ├── site.ts               navigation, Buy coffee link
│   │       ├── layouts/MainLayout.astro
│   │       ├── components/           PageHero, BuyCoffee
│   │       └── pages/                index, beyond-coffee (Our brand), our-estate, our-coffee,
│   │                                 sustainability, our-people, contact, privacy, 404, robots.txt
│   └── shop/
│       ├── astro.config.mjs          site URL, sitemap (placeholder products excluded)
│       ├── public/
│       └── src/
│           ├── site.ts
│           ├── data/products.ts      ← the product catalogue
│           ├── layouts/ShopLayout.astro
│           ├── components/           ProductCard, OrderPanel, HowToOrder
│           └── pages/                index, products/index, products/[slug], about-our-coffee,
│                                     contact, privacy, 404, robots.txt
├── packages/brand/                   shared config, styles, components (see above)
│   └── photos/                       ← drop estate photographs here
├── scripts/
│   ├── verify-sites.mjs              post-build SEO/link/sitemap verification
│   ├── content-status.mjs            lists everything still missing
│   ├── import-legacy-site.mjs        copies text + images from the old website
│   └── generate-brand-assets.mjs     favicons + social share images
├── CLAUDE.md                         original project brief
├── README.md  SEO-STRATEGY.md  IMAGE-ASSETS.md  DEPLOYMENT.md
└── .env.example
```

## Getting started

**Prerequisites:** Node.js **22.23.4 or newer** (Astro 7 requires it; `.nvmrc`
pins 22.23.5) and npm 10+.

```bash
git clone https://github.com/smkrmuthu/gbsite.git
```

```bash
cd gbsite
```

```bash
npm install
```

| Command (from the repo root) | What it does |
| --- | --- |
| `npm run dev:main` | Brand site at http://localhost:4321 with live reload |
| `npm run dev:shop` | Shop at http://localhost:4322 |
| `npm run build` | Builds both sites (`build:main`, `build:shop` for one) |
| `npm run preview:main` / `preview:shop` | Serves the built site locally |
| `npm run check` | TypeScript and Astro diagnostics for both apps |
| `npm run verify` | After a build: titles, descriptions, canonicals, links, sitemaps, robots, JSON-LD |
| `npm run ci` | check + build + verify (use this before every deploy) |
| `npm run content:status` | Lists contact details, products, photos and facts still missing |
| `npm run import:legacy` | Copies the old site's text and images into `legacy-import/` for review |
| `npm run assets:brand` | Regenerates favicons and share images (needs Playwright) |

In development, links from one site to the other point at the production
domains. To keep them local, create `apps/main/.env` with
`PUBLIC_SHOP_URL=http://localhost:4322` and `apps/shop/.env` with
`PUBLIC_MAIN_SITE_URL=http://localhost:4321`.

## Configuration

### Content configuration: `packages/brand/config/brand.config.ts`

| Setting | Effect when filled in | Effect when empty |
| --- | --- | --- |
| `contact.email` | Shown on both contact pages and in the footer; the contact form opens the visitor's email app | Hidden |
| `contact.phone` | Shown with a `tel:` link | Hidden |
| `contact.address`, `contact.mapUrl` | Full address and map link | Shows "Yercaud, Tamil Nadu, India" only |
| `contact.formEndpoint` | Contact form POSTs to this service (Formspree, Web3Forms, etc.) | Form uses email, or is hidden if no email either |
| `ordering.externalUrl` (+ `externalLabel`) | Order buttons go to this page | Falls back to WhatsApp |
| `ordering.whatsappNumber` | Order buttons open WhatsApp with a pre-written message naming the product | Falls back to email, then to a "contact us to order" note |
| `social` | Footer and contact-page links; X handle used for Twitter cards; `sameAs` in schema | Hidden |
| `logo` | Official logo in header (forest), footer (white) and Organization schema | Typographic wordmark if set to `null` |

### Deployment settings: environment variables

Set these in your hosting dashboard (or copy `.env.example` to `apps/<app>/.env`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `PUBLIC_MAIN_SITE_URL` | `https://glazebrookecoffee.com` | Brand site domain: canonicals, sitemap, cross-links |
| `PUBLIC_SHOP_URL` | `https://shop.glazebrookecoffee.com` | Shop domain: **every Buy coffee link** and the shop's canonicals |
| `PUBLIC_GA4_ID` | empty | GA4 measurement ID. Empty = no analytics code at all |
| `PUBLIC_GSC_VERIFICATION` | empty | Google Search Console HTML-tag token |
| `PUBLIC_HIDE_PLACEHOLDERS` | `false` | `true` hides "To be supplied" notes and photo-placeholder captions |
| `PUBLIC_PUBLISH_UNVERIFIED_FACTS` | `true` | `false` removes every unverified fact from the copy |

Both sites read the same variables, so set the domain variables identically on
both deployments.

## Updating content

- **Shop URL / domains:** change `PUBLIC_SHOP_URL` / `PUBLIC_MAIN_SITE_URL`, then rebuild both sites.
- **Contact details, ordering route, social links, logo:** edit `packages/brand/config/brand.config.ts`.
- **Estate facts:** `packages/brand/config/facts.ts`. Each fact carries its source.
  Set `verified: true` once the estate confirms it. Page copy reads these values,
  so changing a value (for example the elevation) updates every page.
- **Products:** `apps/shop/src/data/products.ts` (instructions at the top). The five
  products (Chandragiri, Selection 9, Yellow Maragogipe, Selection 5B, HRC) are named
  from the jar labels on the old site. Add `variants` (size + price), `roast`, `form`,
  `process` and `tastingNotes` as the estate confirms them: each product page lists
  what is still missing. Products are indexed, listed in the sitemap and get Product
  structured data (offers only when a price is entered). Order buttons appear once an
  ordering route is configured.
- **Photographs:** save a file in `packages/brand/photos/` named after a slot
  (see `packages/brand/photos/README.md` and `config/photos.ts`, where alt text and
  focal points live). The build optimises it automatically. Then update `IMAGE-ASSETS.md`.
- **Page copy:** edit the `.astro` files in `apps/*/src/pages/`. Text is plain
  HTML inside each file. "To be supplied" notes are `<Pending … />` elements:
  replace each with real content and delete the note.
- **Navigation:** `apps/main/src/site.ts` and `apps/shop/src/site.ts`.
- **Colours and type:** `packages/brand/styles/tokens.css` (contrast ratios are noted inline).

## Content still needed from the estate

`npm run content:status` prints the live list. At handover it was:

1. **Verification of facts** currently used in the copy (sourced only from the
   project brief's description of the old site): established in the **1950s**,
   **more than 70 years** of heritage, **family-owned**, grown at approximately
   **3,400–4,200 ft**. To remove them all until confirmed, set
   `PUBLIC_PUBLISH_UNVERIFIED_FACTS=false`.
2. **Contact details:** email, phone, postal address, map link, and a form route.
3. **Ordering route:** WhatsApp number or external ordering URL. Also confirm how
   payment and delivery are arranged, so the shop's "How ordering works" steps
   describe them accurately.
4. **Products:** sizes, prices, roast, whole bean or ground, process and tasting
   notes for the five named coffees. Also confirm the names and the variety facts
   used, and whether the jar images show the real packaging.
5. **Photographs:** confirm which supplied photos were taken at Glazebrooke and
   that the estate may reuse them (see `IMAGE-ASSETS.md`), and get consent from
   the woman shown sorting cherries. Still missing: a family/heritage photo and a
   team portrait.
6. **Story content:** family history and founding details, biodiversity, actual
   sustainability practices (and any certifications actually held), team
   profiles (with consent), and confirmation of the four values on the Our Brand page.
7. **Vector (SVG) logo**, approval of the forest-green header version, and
   **social profile URLs**.
8. **Privacy notice review**, and the **list of old URLs** for redirects.

When all of this is done, set `PUBLIC_HIDE_PLACEHOLDERS=true` and run `npm run ci`.

## About the previous website

`https://glazebrookecoffee.com` (including `/beyond-coffee/`) could not be
reached from the build environment. The owner supplied its logo and images
(see `IMAGE-ASSETS.md`), but not yet its text. To copy its text (and its URL
list for redirects) from any machine that can reach it, run:

```bash
npm run import:legacy
```

This writes page text (`legacy-import/pages/*.md`), images with an inventory,
discovered contacts and products (`SITE-FACTS.md`), and a crawl report to
`legacy-import/`. Nothing is published automatically. Review the output, confirm
image rights, then move the confirmed pieces into the config files and
`packages/brand/photos/`.

## Deployment overview

Each app builds to its own `dist/` folder of static files and can be hosted
anywhere: Cloudflare Pages, Netlify, Vercel, S3/CloudFront, or any web server.
Each app also has a `wrangler.jsonc` for Cloudflare Workers (static assets), the
recommended host: `npx wrangler deploy --config apps/<app>/wrangler.jsonc` after
building.
See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions, DNS, HTTPS,
redirects and post-launch checks.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `npm install` or build fails with an engine error | Use Node ≥ 22.23.4 (`nvm use`) |
| Cannot find module `@glazebrooke/brand/...` | Run `npm install` from the **repo root** (workspaces link the package) |
| A new photo does not appear | The filename must exactly match a slot key (case-sensitive) and live in `packages/brand/photos/`; restart `npm run dev:*` |
| Buy coffee links point at the wrong domain | Set `PUBLIC_SHOP_URL` on the **brand site** deployment and rebuild |
| Canonicals/sitemap show the wrong domain | Set `PUBLIC_MAIN_SITE_URL` / `PUBLIC_SHOP_URL` and rebuild |
| Contact form missing | Set `contact.email` or `contact.formEndpoint` in `brand.config.ts` |
| No Order button on a product | Product must be `status: 'published'` **and** an ordering route must be configured |
| `npm run verify` reports errors | Run `npm run build` first; each message names the page and the problem |
| `import:legacy` captures nothing | The old site must be reachable from your machine; behind a proxy use `NODE_USE_ENV_PROXY=1 npm run import:legacy` |
