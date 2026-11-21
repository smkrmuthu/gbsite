# Photographs

Drop estate photographs here, named after a photo slot, and both sites use
them automatically on the next build (optimised to AVIF/WebP/JPEG at
responsive sizes). No code changes needed.

| File name (any of .jpg .png .webp .avif) | What it should show |
| --- | --- |
| `estate-hero` | Wide landscape of the estate slopes (home page hero, min. 2560px wide) |
| `estate-slopes` | Coffee plants across the hillside |
| `estate-shevaroy-view` | View from the estate across the hills |
| `estate-nature` | Trees, wildlife or forest around the coffee |
| `estate-water-soil` | Soil, leaf litter or a stream on the estate |
| `coffee-cherries` | Close-up of coffee cherries on the branch |
| `coffee-beans` | Glazebrooke coffee beans, green or roasted |
| `coffee-cup` | A brewed cup of Glazebrooke coffee |
| `heritage-archive` | An archival family or estate photograph |
| `heritage-family` | Portrait of the family today |
| `people-harvest` | The team at work during harvest (with consent) |
| `people-portrait` | Portrait of a team member (with consent) |
| `people-craft` | Hands at work: picking, sorting or drying |
| `shop-hero` | Glazebrooke coffee packaging |
| `product-<slug>` | Product photo for `apps/shop/src/data/products.ts` entry `<slug>` |

After adding a photo:
1. Check the slot's alt text in `../config/photos.ts` still describes it.
2. Record the photo in `IMAGE-ASSETS.md` (source, photographer, permission).

Only use photographs of Glazebrooke itself in these slots, and only with
permission to publish. Never use stock or AI-generated images here: the
captions and alt text present these as the estate.
