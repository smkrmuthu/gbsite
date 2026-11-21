# Claude Code Master Prompt: Glazebrooke Coffee Website Redesign

## Project

Redesign and build a modern, stylish, minimalist, premium digital experience for **Glazebrooke Coffee Estate**, based in Yercaud, India. The existing site is https://glazebrookecoffee.com/ and the primary reference page is https://glazebrookecoffee.com/beyond-coffee/.

Act as a senior product designer, creative director, SEO specialist, accessibility-minded frontend engineer, and full-stack developer. Deliver working, responsive websites—not just a concept or homepage mockup.

There are two connected but independently deployable experiences:

1. **Main brand website** at `https://glazebrookecoffee.com/`, focused on estate storytelling, heritage, coffee, nature, people, sustainability, and contact.
2. **Lightweight coffee shop** at `https://shop.glazebrookecoffee.com/`, focused on a product catalogue and product information. Phase 1 is mostly static; do not build payments, inventory, accounts, or a complex cart. Ordering can link to a configurable WhatsApp number or external ordering service.

The main site's **Buy Coffee** calls to action must go to a configurable shop URL. Keep the shop URL, ordering URL/WhatsApp number, contact details, social links, and analytics IDs in clear configuration rather than scattering them through components.

## How to work

1. Inspect the current repository, framework, scripts, dependencies, and existing content before changing anything. Preserve a working application where possible; do not replace files blindly.
2. Audit the existing Glazebrooke website, especially the Beyond Coffee page. Review its navigation, copy, brand marks, photography, product information, contact information, social links, and existing URLs. Use only facts that can be verified from the existing site or project files.
3. Summarize the audit and a short implementation plan, then continue into implementation without waiting for approval. If browsing or a source is unavailable, record the limitation and use clearly marked placeholders for missing information.
4. Build the two experiences as separate deployable applications or clearly separated apps in a monorepo, choosing an architecture appropriate to the existing project. Keep shared design tokens consistent.
5. Implement the complete experience, then review and refine it for visual quality, responsiveness, accessibility, SEO, and performance. Do not stop at a mockup.
6. Run the available project checks and build commands. If Lighthouse or an equivalent audit is available, review accessibility, SEO, performance, and best practices; report the actual results and any remaining issues.

## Brand and content direction

Position Glazebrooke as a premium, heritage-driven, estate-grown coffee brand rooted in nature, craftsmanship, and Yercaud. Desired qualities: elegant, natural, authentic, calm, contemporary, minimalist, and welcoming, with Indian coffee estate heritage clearly present.

The existing site has described the estate as family-owned, established in the 1950s, with more than 70 years of heritage and coffee grown at approximately 3,400–4,200 feet. Verify each fact before using it. Preserve verified brand facts and original identity. Do not invent certifications, awards, product varieties, tasting notes, processing methods, customer reviews, sustainability metrics, prices, weights, contact details, or claims. Treat keyword ideas below as targeting suggestions, never as claims of current ranking.

Use polished, concise editorial copy. Avoid generic luxury-brand filler, unsupported superlatives, and repetitive text. Keep placeholders obvious and document them for the owner to replace.

## Design direction

Use a premium editorial direction called **Nature Luxury**: forest green, espresso, warm cream, natural beige, muted olive, refined typography, whitespace, and cinematic authentic estate photography. Suggested palette: forest green `#183C32`, espresso `#30231D`, warm cream `#F6F2E9`, beige `#D9C9AE`, olive `#858B69`, and white. Adjust where needed for contrast and legibility.

Pair an elegant serif for large headings (for example, Cormorant Garamond or Playfair Display) with a readable sans serif (for example, Inter or Manrope). Use large editorial type, considered spacing, asymmetrical layouts, minimal navigation, restrained line icons, and subtle transitions. Aim for quiet confidence and excellent mobile layouts.

Use Aesop, Blue Bottle Coffee, Nespresso, Onyx Coffee Lab, and premium boutique hospitality sites only as quality references; do not copy their layouts, assets, or distinctive branding. Avoid excessive gradients, bright colors, card grids, rounded-card overload, parallax, motion, and decorative effects. Respect reduced-motion preferences.

## Main brand website

Create a responsive, navigable multi-page experience (or a well-structured site with dedicated indexable pages for significant topics). Suggested navigation: Home, Our Brand, Our Estate, Our Coffee, Sustainability, Our People, and Buy Coffee. Keep navigation elegant, accessible, and easy to use on mobile. Preserve valuable existing URLs where possible; if routes change, document appropriate redirects.

Include these content areas, using verified information and authentic imagery:

- **Home / hero:** immersive estate photography, clear brand statement, and “Discover Our Story” and “Explore Our Coffee” links. A possible headline is “Beyond Coffee. A Legacy Rooted in Nature.” Do not imply the image depicts Glazebrooke unless it does.
- **Our story:** family heritage, Yercaud roots, and generations of coffee growing. Possible headline: “More Than Seven Decades. One Passion. Coffee.” Use only after verifying the timeline.
- **Our estate:** location, growing environment, elevation, natural surroundings, and biodiversity, all fact-checked. Possible headline: “Where Nature Shapes Every Bean.”
- **Our philosophy:** care, quality, authenticity, and relationship with nature, without unsupported process claims.
- **Sustainability and biodiversity:** verified practices and coexistence with nature. Possible headline: “Growing Coffee. Preserving Nature.” Do not claim certifications or measured impact without evidence.
- **Our people:** authentic photography and respectful storytelling about the people and craft behind the estate.
- **Our coffee:** introduce only verified products and details. Link clearly to the shop.
- **Buy Coffee CTA:** elegant but visible invitation. Possible headline: “Bring the Taste of Glazebrooke Home.” Use the configured shop URL and same-tab navigation unless there is a clear reason otherwise.
- **Contact:** verified contact details, estate location, enquiry/partnership route, and social links. Do not leave dummy details live. If no backend exists, make the form behavior explicit and provide a working alternative contact route.

Suggested hero supporting copy: “Discover the story of Glazebrooke Coffee Estate, where generations of passion meet the richness of nature.” Edit to avoid unverified claims.

## Separate static coffee shop

Build a lightweight storefront visually consistent with the main brand but independently deployable. Suggested pages: Home, Shop All, Product Details, About Our Coffee, and Contact.

Include a product-led hero, concise introduction, featured products, reusable product cards, product details, and clear ordering calls to action. A product card may show image, verified name, description, available size, and price only when supplied and confirmed. Product pages can include origin, size, price, packaging, and product description only when verified. Do not invent product names, sizes, prices, stock status, ratings, or reviews. Use clearly labeled placeholders where details are not available.

Phase 1 order links may point to a configurable WhatsApp URL or external ordering URL. Make it obvious what happens when a visitor clicks. Keep the data model easy to connect to Shopify, WooCommerce, or a custom backend later, without implementing those systems now.

## Existing website photographs and assets

Use the existing Glazebrooke website as the first source for photography and visual assets:

- https://glazebrookecoffee.com/
- https://glazebrookecoffee.com/beyond-coffee/

Inspect available pages and assets for estate, plantation, coffee, nature, people, and product imagery. Reuse existing assets wherever technically and legally permitted. When permitted, download and organize them in the project's local asset directory rather than hotlinking. Preserve quality and prepare appropriate desktop/mobile sizes; use WebP or AVIF when suitable. Add lazy loading for below-the-fold images and avoid unnecessarily large payloads.

Never fabricate Glazebrooke photographs or present stock/generated imagery as actual estate photography. If a needed asset cannot be reused or verified, use a clearly identified placeholder or a properly licensed, clearly non-documentary image and record that status. Note any licensing or permission question for owner verification; do not assume reuse rights merely because an image is publicly visible.

Create `IMAGE-ASSETS.md` in the project root. For every used image record: filename, original source URL, where it is used, description, whether it is original estate photography or a placeholder/other asset, and relevant reuse/licensing notes or verification needed.

## SEO requirements for both sites

Implement SEO from the start. Each site must be independently indexable on its production domain, with its own canonical URLs, sitemap, and `robots.txt`. Preserve useful existing paths where practical and document redirects for changed URLs. Do not accidentally block crawling or apply `noindex` to public pages. Ensure important pages are internally linked and have unique, accurate titles and descriptions.

### Main site search themes

Consider relevant intent around Glazebrooke Coffee, Glazebrooke Coffee Estate, Yercaud Coffee Estate, coffee plantation in Yercaud, estate-grown coffee in India, premium Indian coffee, specialty coffee from India, coffee estate in Tamil Nadu, and sustainable coffee farming. Use naturally; do not keyword-stuff or claim rankings.

### Shop search themes

Consider Glazebrooke Coffee buy online, Glazebrooke estate coffee, premium coffee beans India, coffee from Yercaud, and Indian estate coffee. Use only product and purchase claims supported by verified information.

### Implement and verify

- Unique page title and meta description for every indexable page.
- Correct heading hierarchy, semantic HTML5, descriptive link text, and useful image alt text. Use empty alt text for decorative images.
- Canonical URLs for the correct production domain.
- Open Graph and X/Twitter sharing metadata.
- Separate XML sitemaps and `robots.txt` files for the two sites.
- Organization structured data where appropriate; LocalBusiness only when supported by verified public details; breadcrumb structured data where applicable; Product structured data only when actual product facts are available.
- Never include invented price, stock availability, ratings, or reviews in structured data.
- Mobile friendliness, internal links, descriptive image filenames, optimized images, and fast loading/Core Web Vitals-conscious implementation.
- Prepare configurable Google Search Console verification and GA4 integration. Never invent verification tokens or tracking IDs. Track visits and meaningful actions such as shop clicks or product enquiries only where consent/privacy requirements and project setup allow.
- Validate rendered metadata, sitemap routes, robots behavior, canonical domains, structured data, and links. Report what was checked and any remaining manual setup.

## Accessibility, UX, and engineering

Both sites must be responsive and mobile-first, work across phone/tablet/desktop, and be usable with keyboard and assistive technology. Provide visible focus states, sufficient contrast, labels and accessible form errors, semantic landmarks, meaningful alt text, and reduced-motion support. Keep the Buy Coffee action easy to find without making the brand site feel overly commercial.

Use smooth scrolling and restrained fade/hover effects only when they help. Include sticky navigation only when it improves the experience. Avoid broken links, inaccessible controls, unnecessary dependencies, and console errors. Use reusable components and maintainable content/configuration. Optimize images and lazy-load below-the-fold media.

First identify the current stack. If starting fresh, choose a suitable modern stack (for example React with TypeScript and Vite or Next.js, with an appropriate styling approach); do not force a new framework if the existing project is sound. Keep applications independently deployable and share brand tokens sensibly.

## Required project documentation

Create all four Markdown files in the project root, and ensure they accurately describe the implementation rather than aspirations:

### `README.md`

Include project overview and brand introduction; site architecture; actual technology stack; folder structure; prerequisites; install, local development, and build commands; deployment overview; domains; environment variables/configuration; how to update content, products, shop URL, contact details, social links, and images; and troubleshooting for a new developer.

### `SEO-STRATEGY.md`

Include SEO objectives; audiences, search intent, and target keyword themes; page-by-page strategy with suggested titles and meta descriptions; URL structure; structured data choices; internal linking; image SEO; sitemap and robots details; Google Search Console and GA4 setup; validation checklist; and future opportunities. Distinguish implemented items from recommendations and manual tasks.

### `IMAGE-ASSETS.md`

Include the complete image inventory and the source, location, description, authenticity/placeholder status, and reuse/licensing notes for every image, as described above.

### `DEPLOYMENT.md`

Give separate deployment instructions for the main brand site and shop, including build and output directories, hosting assumptions, domain and DNS configuration, HTTPS, environment configuration, redirects, production build/verification, and post-deployment checks. State unknown provider-specific details as configuration to confirm; do not fabricate credentials or account details.

## Final review and delivery checklist

Before calling the work complete, confirm and report:

- [ ] Complete responsive main brand website and separate responsive static shop.
- [ ] Existing Glazebrooke assets reused where permitted, with every image documented.
- [ ] Brand facts, product information, contact information, and claims verified or clearly marked as placeholders.
- [ ] Navigation, forms/contact routes, shop links, and ordering links work.
- [ ] SEO metadata is unique and implemented across both sites.
- [ ] Each site has its own sitemap, robots rules, and correct canonicals.
- [ ] Structured data contains only verified information.
- [ ] Images are optimized and mobile performance reviewed.
- [ ] Accessibility, responsive behavior, internal/external links, and console checked.
- [ ] Available builds and project checks pass; Lighthouse (or equivalent) reviewed where available.
- [ ] `README.md`, `SEO-STRATEGY.md`, `IMAGE-ASSETS.md`, and `DEPLOYMENT.md` exist and match the actual project.
- [ ] Deployment configuration, analytics IDs, permissions, or content still needed from the owner are listed clearly.

Preserve existing valuable URLs when possible and document required redirects. Prepare for Google Search Console registration of both domains and GA4 configuration, but do not claim those services are live without credentials and verification. Give a final summary of what was built, checks performed and their results, outstanding owner inputs, and deployment readiness.
