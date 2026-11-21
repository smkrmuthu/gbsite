/**
 * Glazebrooke product catalogue (Phase 1: static).
 *
 * HOW TO ADD A REAL PRODUCT
 * 1. Copy an entry, give it a unique `slug` (lowercase-with-hyphens; it becomes
 *    the URL /products/<slug>/) and fill in ONLY confirmed details.
 * 2. Set `status: 'published'`. Published products are indexed, listed in the
 *    sitemap, get Product structured data and show an Order button.
 * 3. Add a photo as packages/brand/photos/product-<slug>.jpg (see IMAGE-ASSETS.md).
 * 4. Delete the placeholder entries once real products exist.
 *
 * Leave unknown optional fields out. Never guess prices, sizes, stock or
 * tasting notes: anything absent is simply not shown, and nothing invented
 * reaches structured data.
 *
 * The shape is deliberately close to Shopify/WooCommerce product + variant
 * models so it can later be fed from either (see `externalIds`).
 */

export interface Price {
  /** Amount in major units, e.g. 450 for ₹450. */
  amount: number;
  currency: 'INR';
}

export interface Variant {
  /** Shown to customers, e.g. '250 g', '500 g whole bean'. */
  label: string;
  sku?: string;
  price?: Price;
  /** Only set when the estate actively maintains stock status. */
  availability?: 'in_stock' | 'out_of_stock' | 'preorder';
}

export interface Product {
  slug: string;
  /** 'placeholder' = layout stand-in: not indexed, no order button, no schema. */
  status: 'placeholder' | 'published';
  name: string;
  /** One or two sentences for cards. */
  summary: string;
  /** Paragraphs for the product page. */
  description: string[];
  /** Photo slot key; file = packages/brand/photos/<photo>.jpg */
  photo: `product-${string}`;
  photoAlt?: string;
  /** e.g. 'Glazebrooke Coffee Estate, Yercaud, Tamil Nadu' */
  origin?: string;
  /** e.g. 'Arabica' — only if confirmed. */
  species?: string;
  process?: string;
  roast?: string;
  /** e.g. 'Whole bean' or 'Ground (filter)'. */
  form?: string;
  tastingNotes?: string[];
  packaging?: string;
  variants: Variant[];
  featured?: boolean;
  /** Product-specific ordering link; overrides the global ordering route. */
  orderUrl?: string;
  /** IDs in a future commerce backend. */
  externalIds?: { shopify?: string; woocommerce?: string };
}

/*
 * Product names are taken from the jar labels in the product images supplied
 * from the previous website (November 2026). The `species` and first
 * description paragraph are general, published facts about each named coffee
 * variety, not estate claims. Pack sizes, prices, roast, form and tasting notes
 * are NOT yet confirmed, so they are omitted. Each product page shows a
 * "To be supplied" note listing them.
 */
const ORIGIN = 'Glazebrooke Coffee Estate, Yercaud, Tamil Nadu';
const GROWN = 'From Glazebrooke Coffee Estate in Yercaud, in the Shevaroy Hills of Tamil Nadu.';

export const products: Product[] = [
  {
    slug: 'chandragiri',
    status: 'published',
    name: 'Chandragiri',
    summary: 'An Arabica coffee of the Chandragiri variety, from Glazebrooke Coffee Estate in Yercaud.',
    description: ['Chandragiri is an Arabica coffee variety developed in India by the Central Coffee Research Institute.', GROWN],
    photo: 'product-chandragiri',
    photoAlt: 'Jar of Chandragiri coffee beans',
    origin: ORIGIN,
    species: 'Arabica',
    variants: [],
    featured: true,
  },
  {
    slug: 'selection-9',
    status: 'published',
    name: 'Selection 9',
    summary: 'An Arabica coffee of the Selection 9 variety, from Glazebrooke Coffee Estate in Yercaud.',
    description: ['Selection 9 (Sln. 9) is an Arabica coffee selection developed in India by the Central Coffee Research Institute.', GROWN],
    photo: 'product-selection-9',
    photoAlt: 'Jar of Selection 9 coffee beans',
    origin: ORIGIN,
    species: 'Arabica',
    variants: [],
    featured: true,
  },
  {
    slug: 'yellow-maragogipe',
    status: 'published',
    name: 'Yellow Maragogipe (YMG)',
    summary: 'An Arabica coffee of the Yellow Maragogipe variety, from Glazebrooke Coffee Estate in Yercaud.',
    description: ['Maragogipe is an Arabica coffee variety known for its unusually large beans. Yellow Maragogipe is its yellow-fruited form.', GROWN],
    photo: 'product-yellow-maragogipe',
    photoAlt: 'Jar of Yellow Maragogipe coffee beans',
    origin: ORIGIN,
    species: 'Arabica',
    variants: [],
    featured: true,
  },
  {
    slug: 'selection-5b',
    status: 'published',
    name: 'Selection 5B',
    summary: 'An Arabica coffee of the Selection 5B variety, from Glazebrooke Coffee Estate in Yercaud.',
    description: ['Selection 5B (Sln. 5B) is an Arabica coffee selection developed in India by the Central Coffee Research Institute.', GROWN],
    photo: 'product-selection-5b',
    photoAlt: 'Jar of Selection 5B coffee beans',
    origin: ORIGIN,
    species: 'Arabica',
    variants: [],
  },
  {
    slug: 'hrc-hybrid-robusta',
    status: 'published',
    name: 'HRC (Hybrid Robusta Coffee)',
    summary: 'A hybrid Robusta coffee from Glazebrooke Coffee Estate in Yercaud.',
    description: ['HRC stands for Hybrid Robusta Coffee.', GROWN],
    photo: 'product-hrc-hybrid-robusta',
    photoAlt: 'Jar of HRC Hybrid Robusta coffee beans',
    origin: ORIGIN,
    species: 'Robusta (hybrid)',
    variants: [],
  },
];

export const isPublished = (p: Product) => p.status === 'published';

export const formatPrice = (p: Price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: p.currency, maximumFractionDigits: 0 }).format(p.amount);

/** Price summary for cards: single price, "From ₹x", or null when no prices are confirmed. */
export function priceSummary(product: Product): string | null {
  const prices = product.variants.map((v) => v.price).filter((p): p is Price => !!p);
  if (prices.length === 0) return null;
  const min = prices.reduce((a, b) => (b.amount < a.amount ? b : a));
  const allSame = prices.every((p) => p.amount === min.amount);
  return allSame ? formatPrice(min) : `From ${formatPrice(min)}`;
}

/** Slugs to exclude from the sitemap (placeholders are noindex). */
export const unlistedSlugs = products.filter((p) => !isPublished(p)).map((p) => p.slug);
