# SEO strategy

Covers both sites. Each item is marked **Implemented** (in the code and checked),
**Recommended** (worth doing, not done), or **Manual** (needs the owner or an
account). No rankings are claimed. The keyword themes below are targets, not
current positions.

## 1. Objectives

1. Make Glazebrooke the clear result for brand searches ("Glazebrooke Coffee",
   "Glazebrooke Coffee Estate") on both domains.
2. Be discoverable for place-and-origin searches: Yercaud coffee estate, coffee
   plantation in Yercaud, coffee estate in Tamil Nadu, estate-grown coffee in India.
3. Send purchase-intent visitors to the shop, and let shop pages rank for
   "buy Glazebrooke coffee" and origin-led product searches.
4. Keep every claim in search snippets and structured data accurate.

## 2. Audiences and search intent

| Audience | Typical intent | Landing page |
| --- | --- | --- |
| People who already know the brand | Navigational: "glazebrooke coffee" | Brand home, shop home |
| Coffee buyers in India looking for origin coffee | Commercial: "Yercaud coffee buy", "estate coffee India" | Shop home, Shop all, product pages |
| Visitors to Yercaud and the Shevaroys | Informational: "coffee estate Yercaud" | Our estate, Our brand |
| Trade, cafés, partners, press | "coffee estate Tamil Nadu supplier/partnership" | Contact (topic: trade and partnerships) |
| People researching sustainable coffee | "sustainable coffee farming India" | Sustainability (strengthens once real practices are published) |

## 3. Keyword themes

**Brand site:** Glazebrooke Coffee · Glazebrooke Coffee Estate · Yercaud coffee
estate · coffee plantation in Yercaud · coffee estate in Tamil Nadu · estate-grown
coffee in India · premium Indian coffee · specialty coffee from India ·
sustainable coffee farming.

**Shop:** Glazebrooke Coffee buy online · Glazebrooke estate coffee · premium
coffee beans India · coffee from Yercaud · Indian estate coffee.

Used naturally in titles, headings and copy, never stuffed. "Specialty" and
"premium" are **not** asserted anywhere in the copy, because no grading,
cupping score or quality evidence has been supplied. Add them only with evidence.

## 4. Page-by-page (Implemented)

All titles and descriptions are unique (checked by `npm run verify`). Titles use
"Topic | Brand"; descriptions are roughly 90–160 characters.

### Brand site: `https://glazebrookecoffee.com`

| URL | Title | Meta description | Primary themes |
| --- | --- | --- | --- |
| `/` | Glazebrooke Coffee Estate \| Estate-Grown Coffee from Yercaud, Tamil Nadu | Glazebrooke is a family-owned coffee estate in Yercaud, in the Shevaroy Hills of Tamil Nadu. Discover our story, our estate and our coffee. | brand, Yercaud coffee estate |
| `/beyond-coffee/` (Our brand) | Our Brand: Coffee Heritage in Yercaud \| Glazebrooke Coffee Estate | The story behind Glazebrooke Coffee Estate: a family-owned coffee estate in Yercaud, Tamil Nadu, and the values that guide how we grow coffee. | brand story, heritage |
| `/our-estate/` | Our Estate: A Coffee Plantation in Yercaud \| Glazebrooke Coffee Estate | Glazebrooke Coffee Estate lies in Yercaud in Tamil Nadu's Shevaroy Hills, where our coffee grows on hillside slopes at elevation. Explore the estate. | coffee plantation in Yercaud, coffee estate Tamil Nadu |
| `/our-coffee/` | Our Coffee: Estate-Grown Coffee from India \| Glazebrooke Coffee Estate | Glazebrooke coffee is estate-grown in Yercaud, in the Shevaroy Hills of Tamil Nadu. Learn where our coffee comes from and how to order it. | estate-grown coffee India |
| `/sustainability/` | Sustainability: Growing Coffee, Preserving Nature \| Glazebrooke | How Glazebrooke Coffee Estate thinks about soil, water, trees, wildlife and people in the Shevaroy Hills of Yercaud, where our coffee grows. | sustainable coffee farming |
| `/our-people/` | Our People: The Team Behind the Coffee \| Glazebrooke Coffee Estate | Meet the people of Glazebrooke Coffee Estate in Yercaud, whose care and craft through the year make every harvest possible. | brand, people |
| `/contact/` | Contact Glazebrooke Coffee Estate, Yercaud \| Enquiries and Partnerships | Contact Glazebrooke Coffee Estate in Yercaud, Tamil Nadu, with questions about the estate, our coffee, trade or partnerships. | brand + contact, trade |
| `/privacy/` | Privacy Notice \| Glazebrooke Coffee Estate | How the Glazebrooke Coffee Estate website handles analytics, cookies and the information you send us. | n/a |
| `/404.html` | Page Not Found \| Glazebrooke Coffee Estate | (noindex) | n/a |

### Shop: `https://shop.glazebrookecoffee.com`

| URL | Title | Meta description | Primary themes |
| --- | --- | --- | --- |
| `/` | Glazebrooke Coffee Shop \| Buy Estate Coffee from Yercaud Online | Buy Glazebrooke coffee online: estate-grown coffee from Yercaud in the Shevaroy Hills of Tamil Nadu. Browse the range and see how to order. | Glazebrooke coffee buy online, coffee from Yercaud |
| `/products/` | Shop All Coffee \| Glazebrooke Estate Coffee from Yercaud | The full range of Glazebrooke estate coffee, grown in Yercaud, Tamil Nadu. Compare products and see how to order. | Glazebrooke estate coffee, Indian estate coffee |
| `/products/<slug>/` | `<Product name> \| Glazebrooke Estate Coffee` | Product summary + "Estate-grown at Glazebrooke Coffee Estate, Yercaud, Tamil Nadu." | product + origin |
| `/about-our-coffee/` | About Our Coffee \| Estate Coffee from Yercaud, Tamil Nadu \| Glazebrooke | Where Glazebrooke coffee comes from: a family-owned estate in Yercaud, in the Shevaroy Hills of Tamil Nadu, growing coffee at elevation. | coffee from Yercaud |
| `/contact/` | Contact the Glazebrooke Coffee Shop \| Orders and Product Questions | Questions about Glazebrooke coffee or an order? Contact the Glazebrooke Coffee shop, run by Glazebrooke Coffee Estate in Yercaud, Tamil Nadu. | brand + orders |
| `/privacy/`, `/404.html` | as brand site | | n/a |

The three placeholder product pages (`/products/estate-coffee-placeholder-*/`) are
deliberately `noindex` and excluded from the sitemap until real products replace them.

**Note:** several descriptions say "family-owned", which is an unverified fact.
If `PUBLIC_PUBLISH_UNVERIFIED_FACTS=false` is set, page **copy** drops it, but these
static descriptions do not. Edit them by hand if that fact turns out to be wrong.

## 5. URL structure (Implemented)

- Lowercase, hyphenated, trailing slash, one level deep: `/our-estate/`, `/products/<slug>/`.
- **Preserved:** `/beyond-coffee/`, the previous site's primary brand page, is
  kept at the same URL as the "Our brand" page, so no redirect is needed.
- Each domain is canonical for its own pages only. Cross-domain links are plain
  links, never canonicals.
- `apps/main/public/_redirects` and `apps/shop/public/_redirects` contain 301s for
  likely old paths (`/about/`, `/contact-us/`, `/shop/`, `/product/*` → shop). The
  old site's full URL list is **unknown** (it could not be crawled), so this is
  incomplete. **Manual:** run `npm run import:legacy`, take the URL list from
  `legacy-import/REPORT.md`, and add a 301 for every old URL that does not exist
  in the new build. Also check Search Console's "Pages" report after launch.

## 6. Structured data (Implemented)

JSON-LD in one `@graph` per page, generated in `packages/brand/lib/seo.ts`:

| Type | Where | Contents and limits |
| --- | --- | --- |
| `Organization` | Brand home, shop home | Name, URL, address limited to **locality / region / country** (Yercaud, Tamil Nadu, IN). `email`, `telephone`, `logo`, `sameAs` are added automatically only when configured. No `foundingDate` (only a decade is known). |
| `WebSite` | Both homes | Name, URL, language, publisher → Organization |
| `WebPage` | Every indexable page | Name, description, URL, `isPartOf` WebSite, `about` Organization |
| `BreadcrumbList` | Shop: Shop all, product pages | Matches the visible breadcrumbs |
| `ItemList` | Shop all | Only when published products exist |
| `Product` | Published product pages only | Name, description, brand, manufacturer, image (when a photo exists), SKU when given. `offers` are added **only for variants with an entered price**, and `availability` only when explicitly set. Never ratings or reviews. |

**Not used, deliberately:** `LocalBusiness` (no verified street address,
coordinates, phone or opening hours, and the estate is not confirmed as a
visitor-facing business). Add it once those are confirmed. No `AggregateRating`
or `Review` anywhere: `npm run verify` fails the build check if they appear.

## 7. Internal linking (Implemented)

- Header navigation on every page: Our brand · Our estate · Our coffee ·
  Sustainability · Our people · Contact · **Buy coffee** (to the shop).
- Footer repeats all main pages, plus a link to the sister site.
- Every brand page ends with the "Bring the taste of Glazebrooke home" band
  linking to the shop. Pages cross-link in context (Home → story, estate, coffee,
  sustainability, people; Estate ↔ Sustainability; Our coffee → shop catalogue).
- The shop links back to the estate story (header "The estate", About our coffee,
  origin band, footer).
- Descriptive link text throughout ("Explore the estate", not "click here").
  `npm run verify` checks every internal and cross-site link resolves.

## 8. Image SEO (Implemented, awaiting photos)

- Descriptive slot filenames (`estate-shevaroy-view`, `coffee-cherries`), descriptive
  alt text per slot, empty alt for decorative art, and an `aria-hidden` duplicate
  image link on the home page's topic rows.
- AVIF/WebP, responsive `srcset`/`sizes`, lazy-loading below the fold, explicit
  dimensions. Lighthouse: CLS 0–0.01.
- Default 1200×630 share images per site. Product pages use the product photo as
  `og:image` automatically once one exists.
- **Recommended:** when photos arrive, give the home hero and each page hero a
  page-specific `image` prop on the layout, so shared links show real estate photography.

## 9. Sitemaps and robots (Implemented)

| | Brand site | Shop |
| --- | --- | --- |
| Sitemap | `https://glazebrookecoffee.com/sitemap-index.xml` → `sitemap-0.xml` (8 URLs) | `https://shop.glazebrookecoffee.com/sitemap-index.xml` → `sitemap-0.xml` (5 URLs at handover) |
| Excluded | 404 | 404, placeholder products |
| robots.txt | `User-agent: * / Allow: /` + sitemap line for **this** domain | same, for the shop domain |

Both are generated from the configured domain at build time, so a staging build
with a different `PUBLIC_*_URL` produces matching URLs. No page is blocked, and
`noindex` appears only on the 404 and placeholder products (enforced by `npm run verify`).

## 10. Google Search Console and GA4 (Manual)

**Search Console:** add two **Domain properties**, one each for
`glazebrookecoffee.com` and `shop.glazebrookecoffee.com`. A domain property for
the apex covers the subdomain, but a separate one gives the shop its own reports.
Verify by DNS TXT record (recommended), or set `PUBLIC_GSC_VERIFICATION` to the
HTML-tag token and redeploy. Then submit each `sitemap-index.xml`. No verification
token has been created or committed.

**GA4:** create a GA4 property (one property with both domains as one web data
stream is simplest, or one per site), then set `PUBLIC_GA4_ID=G-…` on each
deployment. Behaviour as implemented:

- Without `PUBLIC_GA4_ID`, no analytics code is shipped at all.
- With it, a consent banner asks first. The Google tag loads **only after "Allow
  analytics"**. The choice is stored locally and can be changed from "Cookie
  settings" in the footer.
- Events sent via `data-track` attributes: `shop_click` (brand → shop),
  `estate_click` (shop → brand), `order_click` (order buttons, labelled with the
  product name), `contact_click` (email/phone/map links), `contact_submit` (form).
- **Manual:** mark `order_click` and `contact_submit` as key events in GA4. If both
  sites share one property, add both domains under *Configure tag settings →
  Configure your domains* for cross-domain measurement.
- Have the privacy notice reviewed for your obligations (for example India's DPDP Act).

## 11. Validation checklist

Run `npm run ci` (check + build + verify) before each deploy.

| Check | Result at handover |
| --- | --- |
| `astro check` (TypeScript, both apps) | ✅ 0 errors, 0 warnings |
| Unique title and description on every indexable page | ✅ (`verify`) |
| Canonical = production domain + path on every indexable page | ✅ |
| Exactly one `<h1>` per page; `lang` set | ✅ |
| OG and Twitter tags present; og:image exists on the right domain | ✅ |
| All `<img>` have alt; links have accessible names; `target=_blank` has `noopener` | ✅ |
| All internal and cross-site links resolve | ✅ |
| JSON-LD parses; no ratings or reviews; offers only with prices | ✅ (also tested with a temporary priced product) |
| Sitemap = exactly the indexable pages; robots allows all and points to its own sitemap | ✅ |
| Lighthouse (mobile, local preview, no photos yet): 6 pages | Performance 100 · Accessibility 100 · Best practices 100 · SEO 100 (placeholder product SEO 66 because it is intentionally `noindex`) |
| Rich Results Test / Schema validator on live URLs | **Manual, after launch** |
| Search Console coverage and sitemap processing | **Manual, after launch** |
| Lighthouse re-run with real photographs on the live host | **Manual.** Photos are the main remaining performance risk. |

## 12. Future opportunities (Recommended)

1. **Real content is the biggest lever:** a founding story, varieties, processing,
   biodiversity and sustainability practices give pages unique, citable substance.
2. Product pages with full origin data (species, process, roast, elevation, harvest)
   plus real photos, so Product rich results become eligible once prices are listed.
3. A journal (`/journal/`): harvest updates, brewing guides, Yercaud and Shevaroy
   coffee history. Good for informational long-tail searches.
4. A Google Business Profile, if the estate receives visitors or trade enquiries
   at a physical address. Then add `LocalBusiness` schema with matching details.
5. Hindi or Tamil versions with `hreflang`, if the audience warrants it.
6. Earn links from Yercaud tourism, Coffee Board of India listings, and food and
   coffee press.
7. When moving to a real commerce backend (Shopify or WooCommerce), keep the
   `/products/<slug>/` URLs or 301 them.
