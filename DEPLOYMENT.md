# Deployment

The repository produces **two independent static sites**. Deploy them as two
separate projects on your host. They share code at build time only.

| | Brand site | Shop |
| --- | --- | --- |
| Production domain | `glazebrookecoffee.com` (+ `www` redirect) | `shop.glazebrookecoffee.com` |
| Build command (run from repo root) | `npm ci && npm run build:main` | `npm ci && npm run build:shop` |
| Output directory | `apps/main/dist` | `apps/shop/dist` |
| Node.js | 22.23.4 or newer (`.nvmrc`: 22.23.5) | same |
| Server runtime | none (static files) | none (static files) |

**Hosting provider:** not yet chosen. Nothing in the build is host-specific. The
`_headers` and `_redirects` files in each `public/` folder use the format read by
**Cloudflare Pages** and **Netlify**. Other hosts ignore them, and you then need
to recreate the redirects in that host's own format. Account names, project
names and credentials are for the owner to set up; none are stored in this repo.

---

## 1. Before any deploy

```bash
npm ci
```

```bash
npm run ci
```

`npm run ci` runs type checks, builds both sites and verifies titles, canonicals,
links, sitemaps, robots and structured data. Do not deploy if it fails.

Then review what is still missing:

```bash
npm run content:status
```

## 2. Environment variables (set per project in the host dashboard)

| Variable | Brand site | Shop | Notes |
| --- | --- | --- | --- |
| `NODE_VERSION` | `22.23.5` | `22.23.5` | Only if the host does not read `.nvmrc` |
| `PUBLIC_MAIN_SITE_URL` | `https://glazebrookecoffee.com` | same | Default if unset |
| `PUBLIC_SHOP_URL` | `https://shop.glazebrookecoffee.com` | same | Default if unset. Drives every Buy coffee link |
| `PUBLIC_GA4_ID` | `G-…` (optional) | `G-…` (optional) | Leave unset until GA4 exists |
| `PUBLIC_GSC_VERIFICATION` | token (optional) | token (optional) | Not needed if you verify by DNS |
| `PUBLIC_HIDE_PLACEHOLDERS` | `false` now, `true` at launch | same | Hides "To be supplied" notes |
| `PUBLIC_PUBLISH_UNVERIFIED_FACTS` | `true` / `false` | same | `false` removes unconfirmed facts from copy |

These are build-time values: **rebuild after changing them.**

## 3. Brand site: step by step

### Option A: Cloudflare Pages (Git integration)

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git →
   select `smkrmuthu/gbsite`.
2. Production branch: `main` (merge the work branch first).
3. Framework preset: None. Build command: `npm run build:main`. Output directory:
   `apps/main/dist`. Root directory: `/` (repo root, so workspaces resolve).
4. Add the environment variables above (both Production and Preview).
5. Deploy, then open the `*.pages.dev` preview URL and run the checks in §7.
6. Custom domains → add `glazebrookecoffee.com` and `www.glazebrookecoffee.com`.
   Add a redirect rule from `www` to the apex (Rules → Redirect Rules, 301).

### Option B: Netlify

1. Add new site → Import from Git → `smkrmuthu/gbsite`.
2. Base directory: (empty). Build command: `npm run build:main`. Publish directory:
   `apps/main/dist`.
3. Add environment variables, deploy, check the preview, then add the domain
   under Domain management, with `www` redirecting to the apex.

### Option C: any static host (S3 + CloudFront, Nginx, cPanel, …)

Build locally or in CI, then upload the **contents** of `apps/main/dist/`. Configure:

- `404.html` as the error document.
- Directory indexes (`/our-estate/` → `/our-estate/index.html`).
- The 301 redirects from `apps/main/public/_redirects`, translated to the server's format.
- The headers from `_headers` (optional, recommended).

## 4. Shop: step by step

Repeat §3 as a **second** project:

- Build command `npm run build:shop`, output `apps/shop/dist`.
- Custom domain `shop.glazebrookecoffee.com`.
- Same environment variables (same domain values; GA4 ID per your analytics plan).

Order buttons only appear once an ordering route is configured in
`packages/brand/config/brand.config.ts` **and** products are `published`.
Changing either needs a rebuild and redeploy of the shop. Changing contact
details affects both sites, so redeploy both.

## 5. Domains, DNS and HTTPS

Exact records depend on the chosen host and DNS provider. **Confirm with the
host's custom-domain screen** rather than copying values from here.

| Name | Type | Typical target |
| --- | --- | --- |
| `glazebrookecoffee.com` (apex) | `A`/`AAAA`, `ALIAS`/`ANAME`, or CNAME-flattening | Value given by the host for the brand-site project |
| `www` | `CNAME` | Brand-site project hostname (then 301 to apex) |
| `shop` | `CNAME` | Shop project hostname (e.g. `<project>.pages.dev` / `<site>.netlify.app`) |

Important when switching the existing domain:

- **Keep the existing email records** (`MX`, SPF/DKIM/DMARC `TXT`) unchanged.
  Only change the web records (`A`/`AAAA`/`CNAME` for apex, `www`, `shop`).
- Lower the TTL of the records you will change a day before the cutover.
- Run `npm run import:legacy` against the old site **before** cutover, while it
  still serves, to capture its text, images and URL list for redirects.
- HTTPS: Cloudflare Pages, Netlify and Vercel issue and renew certificates
  automatically once DNS points at them. Allow a few minutes after DNS changes.
  Enforce HTTPS (redirect HTTP → HTTPS) in the host settings. On self-managed
  servers, use Let's Encrypt (certbot) for both `glazebrookecoffee.com`/`www`
  and `shop`.

## 6. Redirects

- `/beyond-coffee/` is preserved as a page, so it needs no redirect.
- `apps/main/public/_redirects`: `/our-brand`, `/about`, `/about-us/` →
  `/beyond-coffee/`; `/contact-us/` → `/contact/`; `/shop*`, `/product/*` → the shop.
- `apps/shop/public/_redirects`: `/shop/`, `/product/*` → `/products/`.
- **To do before launch:** take the old URL list from `legacy-import/REPORT.md`
  (or Search Console → Pages, or the old site's sitemap) and add a 301 for each
  old URL that is not in the new sitemap. WordPress-style paths such as
  `/category/...`, `/2023/...` and `/wp-content/uploads/...` images that are linked
  externally are the usual candidates.
- If the shop domain or brand domain ever changes, update `PUBLIC_*_URL`, rebuild
  both, and 301 the old domain to the new one.

## 7. Post-deployment checks

On each production domain:

- [ ] `https://glazebrookecoffee.com/` and `https://shop.glazebrookecoffee.com/` load over HTTPS; `http://` and `www` redirect with 301.
- [ ] View source on a few pages: `<link rel="canonical">` shows the **production** domain.
- [ ] `/robots.txt` allows crawling and lists **its own** `sitemap-index.xml`; both sitemaps open and list only that domain's URLs.
- [ ] Buy coffee (brand site) opens the shop in the same tab; "The estate" (shop) opens the brand site.
- [ ] Order buttons, if configured: WhatsApp opens with the product message; external links work.
- [ ] Contact form: submit a real test message through the configured route.
- [ ] 404: an unknown URL shows the styled 404 page with a 404 status.
- [ ] A few old URLs redirect correctly (from the legacy URL list).
- [ ] Analytics, if configured: the banner appears, nothing loads before "Allow", and GA4 Realtime shows the visit after allowing.
- [ ] Share a page in a link-preview debugger (WhatsApp, LinkedIn Post Inspector, Facebook Sharing Debugger) to confirm og:image and title.
- [ ] Google Rich Results Test on the home page and a published product page.
- [ ] Lighthouse (mobile) on the live home page, Our estate, shop home and a product page, especially after real photos are added.
- [ ] Search Console: verify both domains, submit both sitemaps, then watch Pages/Indexing for errors over the following weeks.

## 8. Rollback

Both Cloudflare Pages and Netlify keep every deployment. Roll back from the
project's Deployments list. On other hosts, keep the previous `dist/` upload. The
two sites roll back independently.

## 9. Still to confirm (owner)

- Hosting provider and account (Cloudflare Pages or Netlify recommended for the
  headers and redirects already prepared).
- Who manages DNS for `glazebrookecoffee.com`, and the current email (MX) setup.
- Whether the old WordPress site should be archived, kept on another subdomain, or shut down.
- GA4 property and measurement ID(s); Search Console access.
- Form endpoint service, if a POSTing contact form is preferred over email.
