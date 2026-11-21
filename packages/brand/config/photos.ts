/**
 * Photo slots used across both sites.
 *
 * A slot is filled by a file in `packages/brand/photos/` named after its key
 * (any of .jpg .jpeg .png .webp .avif), e.g. `packages/brand/photos/hills-mist.jpg`.
 * The build generates AVIF/WebP/JPEG at responsive sizes. A slot with no file
 * shows a contour-line placeholder instead. Product photos use the key
 * `product-<slug>` (see apps/shop/src/data/products.ts).
 *
 * Alt text describes what each photo visibly shows. Photos supplied from the
 * previous website have NOT yet been confirmed as taken at Glazebrooke, so the
 * alt text deliberately does not say they were (see IMAGE-ASSETS.md). Once the
 * estate confirms a photo, its alt text may name Glazebrooke.
 *
 * `position` sets the CSS object-position used when a slot crops the photo.
 * `interim` names another slot whose photo is shown (labelled "Interim
 * photograph*") until this slot's own file is supplied.
 * `quality` (1–100, default 72) lowers encoding quality for very detailed
 * photos (aerial foliage) that would otherwise be heavy to download.
 */
export interface PhotoSlot {
  alt: string;
  /** What the placeholder stands in for: shown in the placeholder caption. */
  brief: string;
  position?: string;
  quality?: number;
  interim?: string;
}

export const photoSlots = {
  // ---- Supplied from the previous website (November 2026) ----
  'hills-mist': {
    alt: 'Forested hills fading into haze under a cloudy evening sky',
    brief: 'wide landscape of the hills',
    position: '50% 60%',
  },
  'ghat-road-aerial': {
    alt: 'Aerial view of a hill road climbing through green forest in a series of hairpin bends',
    brief: 'aerial view of the hills',
    quality: 52,
  },
  'forest-road-aerial': {
    alt: 'Aerial view of a road running through dense green forest, with people on two-wheelers',
    brief: 'aerial view of the forest',
    quality: 58,
  },
  'forest-peacock': {
    alt: 'A peacock in the undergrowth beneath tall forest trees',
    brief: 'trees, wildlife or forest around the coffee',
    position: '20% 85%',
  },
  'coffee-branches': {
    alt: 'Coffee branches with clusters of green and ripe red cherries',
    brief: 'coffee cherries on the branch',
  },
  'cherries-in-hands': {
    alt: 'Cupped hands holding freshly picked red and yellow coffee cherries over a heap of cherries',
    brief: 'freshly picked coffee cherries',
    position: '45% 50%',
  },
  'hands-drying-coffee': {
    alt: 'Weathered hands spread across a bed of dried coffee cherries',
    brief: 'coffee drying',
    position: '40% 50%',
  },
  'sorting-cherries': {
    alt: 'A woman sorting ripe coffee cherries from a woven basket onto a sheet',
    brief: 'people at work with the harvest',
    position: '58% 50%',
  },
  'picking-cherries': {
    alt: 'Hands picking ripe coffee cherries from a coffee plant',
    brief: 'coffee being picked by hand',
    position: '55% 50%',
  },
  'coffee-crates': {
    alt: 'Blue crates filled with freshly harvested coffee cherries on a sunlit concrete yard',
    brief: 'the harvest being collected',
  },

  // ---- Still needed from the estate ----
  'heritage-family': {
    alt: 'The family behind Glazebrooke Coffee Estate',
    brief: 'portrait of the family, or an archival estate photograph',
    interim: 'hands-drying-coffee',
  },
  'people-portrait': {
    alt: 'Portrait of a member of the Glazebrooke estate team',
    brief: 'portrait of a team member (with their consent)',
    interim: 'cherries-in-hands',
  },
} satisfies Record<string, PhotoSlot>;

export type PhotoKey = keyof typeof photoSlots | `product-${string}`;
