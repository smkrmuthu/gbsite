# Photographs

Images here are used by both sites automatically (optimised to AVIF/WebP/JPEG
at responsive sizes on each build). The filename (without extension) must match
a slot key in `../config/photos.ts`, or `product-<slug>` for a shop product.

| File | Content | Used on |
| --- | --- | --- |
| `hills-mist.jpg` | Hazy forested hills at dusk | Brand home hero |
| `ghat-road-aerial.jpg` | Aerial: hairpin road through forest | Our estate hero |
| `forest-road-aerial.jpg` | Aerial: road through forest canopy | Our estate |
| `forest-peacock.jpg` | Peacock beneath forest trees | Home, Our estate, Sustainability |
| `coffee-branches.jpg` | Coffee branches with cherries | Home, Sustainability hero |
| `cherries-in-hands.jpg` | Hands holding picked cherries | Our coffee hero, Shop about |
| `hands-drying-coffee.jpg` | Hands on drying coffee | Our coffee |
| `sorting-cherries.jpg` | Woman sorting cherries | Home, Our people hero |
| `picking-cherries.jpg` | Hands picking cherries | Our brand hero |
| `coffee-crates.jpg` | Crates of harvested cherries | Our people |
| `product-*.png` | Product jars (transparent) | Shop |

**Still wanted:** `heritage-family` (family or archival photo) and
`people-portrait` (team member, with consent).

To add or replace a photo: save it here with the slot name, check its alt text
in `../config/photos.ts`, record it in `IMAGE-ASSETS.md`, and run `npm run ci`.

Only use photographs you have the right to publish. Never present stock or
AI-generated images as the estate.
