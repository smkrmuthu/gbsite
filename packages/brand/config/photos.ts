/**
 * Photo slots used across both sites.
 *
 * To add a real photograph, save it in `packages/brand/photos/` using the slot
 * key as the filename (any of .jpg .jpeg .png .webp .avif), e.g.
 * `packages/brand/photos/estate-hero.jpg`. The build picks it up, generates
 * AVIF/WebP/JPEG at responsive sizes, and replaces the contour-line placeholder.
 * Then update the matching row in IMAGE-ASSETS.md (source, permission status).
 *
 * `alt` describes what the real photo must show — check it still matches the
 * photo you add, and edit it if not. Recommended minimum width: 2400px for
 * full-bleed slots, 1600px for others.
 */
export interface PhotoSlot {
  alt: string;
  /** What the placeholder stands in for — shown in the placeholder caption. */
  brief: string;
}

export const photoSlots = {
  'estate-hero': {
    alt: 'Coffee growing on the slopes of Glazebrooke Coffee Estate in Yercaud',
    brief: 'wide landscape of the estate slopes',
  },
  'estate-slopes': {
    alt: 'Rows of coffee plants across the hillside at Glazebrooke',
    brief: 'coffee plants across the hillside',
  },
  'estate-shevaroy-view': {
    alt: 'View across the Shevaroy Hills from Glazebrooke Coffee Estate',
    brief: 'view from the estate across the hills',
  },
  'estate-nature': {
    alt: 'Trees and undergrowth around the coffee at Glazebrooke',
    brief: 'trees, wildlife or forest around the coffee',
  },
  'estate-water-soil': {
    alt: 'Detail of soil, leaf litter or water on the estate',
    brief: 'soil, leaf litter or a stream on the estate',
  },
  'coffee-cherries': {
    alt: 'Ripe coffee cherries on a branch at Glazebrooke',
    brief: 'close-up of coffee cherries on the branch',
  },
  'coffee-beans': {
    alt: 'Glazebrooke coffee beans',
    brief: 'Glazebrooke coffee beans, green or roasted',
  },
  'coffee-cup': {
    alt: 'A cup of Glazebrooke coffee',
    brief: 'a brewed cup of Glazebrooke coffee',
  },
  'heritage-archive': {
    alt: 'Archival photograph from the early years of Glazebrooke Coffee Estate',
    brief: 'an archival family or estate photograph',
  },
  'heritage-family': {
    alt: 'The family behind Glazebrooke Coffee Estate',
    brief: 'portrait of the family today',
  },
  'people-harvest': {
    alt: 'Estate team at work during the coffee harvest at Glazebrooke',
    brief: 'the team at work during harvest (with their consent)',
  },
  'people-portrait': {
    alt: 'Portrait of a member of the Glazebrooke estate team',
    brief: 'portrait of a team member (with their consent)',
  },
  'people-craft': {
    alt: 'Hands sorting coffee at Glazebrooke',
    brief: 'hands at work: picking, sorting or drying',
  },
  'shop-hero': {
    alt: 'Glazebrooke coffee packaging',
    brief: 'Glazebrooke coffee packaging',
  },
} satisfies Record<string, PhotoSlot>;

export type PhotoKey = keyof typeof photoSlots | `product-${string}`;
