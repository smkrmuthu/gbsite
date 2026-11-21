# Image assets

## Summary

- **Source:** in November 2026 the project owner supplied 19 images copied from
  the previous website (glazebrookecoffee.com). The build environment could not
  reach that site, so the original **page URLs** of the images are not known.
  Each is identified below by the filename it was supplied under (two zip files
  uploaded to this repository, since removed from the branch after conversion).
- **In use:** 10 photographs, 5 product images and the logo.
- **Not used:** 3 small cut-out images (too small, and probably not estate photography).
- **Still placeholders:** 2 photo slots (a family/heritage portrait and a team
  portrait) show the contour-line drawing with a "Photograph to come" caption.

### Authenticity and permission: owner to confirm

None of the supplied photographs has yet been **confirmed as taken at
Glazebrooke**. Some look like on-location documentary photography (for example
the woman sorting cherries and the crates of cherries); others could be
commissioned or stock images used on the old site. Until the estate confirms each one:

- Alt text describes only what is **visible** and never says "at Glazebrooke".
- Captions do not claim a location.
- Reuse rights are **unconfirmed**: being on the old website does not prove the
  estate holds a licence that covers a new site.

Please mark each row below as **Estate photo (confirmed)**, **Licensed stock or
photographer (licence covers reuse)**, or **Remove**. Then alt text can name
Glazebrooke where true (edit `packages/brand/config/photos.ts`).

## 1. Photographs in use

Files live in `packages/brand/photos/`. The build serves them as AVIF and WebP
with a JPEG fallback at responsive widths (480–2000px, capped at the original width).

| File | Supplied as | Original size | Used on | Visible content (= alt text) | Status | Rights |
| --- | --- | --- | --- | --- | --- | --- |
| `hills-mist.jpg` | `mountview.png` | 2000×1125 | Brand **home hero** (full width, eager-loaded) | Forested hills fading into haze under a cloudy evening sky | From old site; location not confirmed | To confirm |
| `ghat-road-aerial.jpg` | `roadbend.png` | 2000×1884 | **Our estate** hero | Aerial view of a hill road climbing through green forest in a series of hairpin bends | From old site; looks like a ghat road, location not confirmed | To confirm |
| `forest-road-aerial.jpg` | `beyond_slide_4.png` | 1898×920 | Our estate: growing environment | Aerial view of a road running through dense green forest, with people on two-wheelers | From old site ("Beyond Coffee" slider); location not confirmed | To confirm. Identifiable people? Very small, aerial |
| `forest-peacock.jpg` | `beyond_slide_2.png` | 1910×920 | Home (sustainability row), Our estate (natural surroundings), Sustainability (landscape) | A peacock in the undergrowth beneath tall forest trees | From old site ("Beyond Coffee" slider) | To confirm |
| `coffee-branches.jpg` | `Pasted 21-11-2026 at 19.04.04.png` | 1900×1068 | Home (coffee row), **Sustainability** hero | Coffee branches with clusters of green and ripe red cherries | From old site; could be stock, to confirm | To confirm |
| `cherries-in-hands.jpg` | `ourcoffee_hero.png` | 1920×1080 | **Our coffee** hero; Shop: About our coffee | Cupped hands holding freshly picked red and yellow coffee cherries over a heap of cherries | From old site ("Our coffee" hero) | To confirm. Identifiable person: hands only |
| `hands-drying-coffee.jpg` | `beyond_slide_1.png` | 1900×910 | Our coffee: from hillside to cup | Weathered hands spread across a bed of dried coffee cherries | From old site ("Beyond Coffee" slider) | To confirm |
| `sorting-cherries.jpg` | `coffeewithlady.png` | 1900×1430 | Home (people row), **Our people** hero | A woman sorting ripe coffee cherries from a woven basket onto a sheet | From old site; appears documentary | To confirm, **and the consent of the woman shown** |
| `picking-cherries.jpg` | `contact_hero.png` | 1920×1069 | **Our brand** hero | Hands picking ripe coffee cherries from a coffee plant | From old site (Contact page hero) | To confirm. Hands only |
| `coffee-crates.jpg` | `beyond_slide_5.png` | 1894×920 | Our people: craft and care | Blue crates filled with freshly harvested coffee cherries on a sunlit concrete yard | From old site ("Beyond Coffee" slider); appears documentary | To confirm |

Conversion notes: several supplied PNGs were saved with a uniform partial
transparency (the old site's overlay effect). The colour data was kept and the
transparency removed, so the photos appear at full strength. Converted to JPEG
(quality 90) at original resolution. The two aerial photos use reduced encoding
quality on the site (`quality` in `photos.ts`) to keep the page fast.

## 2. Product images in use

| File | Supplied as | Used on | Alt text | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `product-chandragiri.png` | `L1.png` (1103×1102, transparent) | Shop home hero, product card, `/products/chandragiri/`, share image | Jar of Chandragiri coffee beans | From old site | **Appears to be a rendered product mock-up** (identical jars, plain label). Confirm it represents the real packaging |
| `product-selection-9.png` | `L2.png` | Product card, `/products/selection-9/` | Jar of Selection 9 coffee beans | From old site | As above |
| `product-hrc-hybrid-robusta.png` | `M.png` | Product card, `/products/hrc-hybrid-robusta/` | Jar of HRC Hybrid Robusta coffee beans | From old site | As above |
| `product-yellow-maragogipe.png` | `R1.png` | Product card, `/products/yellow-maragogipe/` | Jar of Yellow Maragogipe coffee beans | From old site | As above |
| `product-selection-5b.png` | `R2.png` | Product card, `/products/selection-5b/` | Jar of Selection 5B coffee beans | From old site | As above |

The **product names** in the shop come from these jar labels.

## 3. Logo and brand graphics

| File | Source | Used on | Description | Status / notes |
| --- | --- | --- | --- | --- |
| `apps/*/public/logo-white.png` (480×86) | Supplied `logo.png` (1404×251, white on transparent), trimmed and resized | Footer of both sites | Official "GLAZEBROOKE COFFEE" wordmark with the bull-head mark in the second O | **Official logo** from the old site. Vector (SVG) artwork requested |
| `apps/*/public/logo-forest.png` (480×86) | Same artwork, recoloured to brand forest green `#183C32` | Header of both sites | As above | Colour variant made for the cream header. Owner to approve the colour |
| `apps/*/public/logo.png` (1080×259) | Forest version padded on white | schema.org `Organization.logo` | As above | For search engines |
| `apps/*/public/og-default.png` (1200×630) | `scripts/generate-brand-assets.mjs` | Default social share image | White logo, "ESTATE"/"SHOP" and a one-line description over contour lines | Brand graphic (not a photo) |
| `apps/*/public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | Same script | Browser tab, home-screen icons | Three ridgelines on forest green | Brand graphic made for this project. Could be replaced by the bull-head mark if vector artwork is supplied |
| Contour-line drawings (inline SVG) | `ContourArt.astro` | Empty photo slots, Buy coffee band | Layered ridgelines | Decorative placeholder art (`aria-hidden`), not documentary |
| Elevation diagram (inline SVG) | `ElevationDiagram.astro` | Home, Our estate, Shop home | Schematic hillside with the 3,400–4,200 ft band | Illustrative ("not to scale"); band depends on an unverified fact |

Fonts in the share images and on the site: Cormorant Garamond and Manrope (SIL Open Font License).

## 4. Supplied but not used

| Supplied as | Size | Content | Why not used |
| --- | --- | --- | --- |
| `coffeeplant.png` | 284×273 | Cut-out coffee sprig with cherries | Too small for any photo slot; generic cut-out style |
| `coffeepowder.png` | 300×191 | Cut-out roasted beans and ground coffee | Too small; generic, likely stock or generated |
| `cup.png` | 228×181 | Cut-out ceramic mug | Too small; generic, likely stock or generated |

## 5. Photo slots still needed

| Slot | Used on | Wanted |
| --- | --- | --- |
| `heritage-family` | Our brand: heritage section | Portrait of the family, or an archival estate photograph (with date and permission) |
| `people-portrait` | Our people: the team | Portrait of a team member, **with written consent** |

Also helpful: a genuine photo of the **real packaging**, and a wide landscape
photo **confirmed as the estate itself** for the home page hero.

## 6. How to add or replace a photo

1. Save the file in `packages/brand/photos/` named after the slot (e.g. `heritage-family.jpg`),
   at least 1600px wide (2400px+ for the home hero).
2. Check or edit the slot's `alt` (and `position` focal point) in `packages/brand/config/photos.ts`.
3. Add a row to this file with its source, photographer and permission.
4. Run `npm run ci`.

Rules: use only photographs you have the right to publish; get consent from
identifiable people; never present stock or AI-generated images as the estate.
