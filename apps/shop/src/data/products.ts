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

export const products: Product[] = [
  {
    slug: 'estate-coffee-placeholder-1',
    status: 'placeholder',
    name: 'Product name to be confirmed',
    summary: 'Placeholder for a Glazebrooke coffee. Replace with the confirmed product name and a short description.',
    description: [
      'This is a placeholder product used to lay out the shop. Its name, description, sizes and price will be added once the estate confirms them.',
    ],
    photo: 'product-estate-coffee-placeholder-1',
    origin: 'Glazebrooke Coffee Estate, Yercaud, Tamil Nadu',
    variants: [],
    featured: true,
  },
  {
    slug: 'estate-coffee-placeholder-2',
    status: 'placeholder',
    name: 'Product name to be confirmed',
    summary: 'Placeholder for a second Glazebrooke coffee, for example a different roast or grind.',
    description: [
      'This is a placeholder product used to lay out the shop. Its name, description, sizes and price will be added once the estate confirms them.',
    ],
    photo: 'product-estate-coffee-placeholder-2',
    origin: 'Glazebrooke Coffee Estate, Yercaud, Tamil Nadu',
    variants: [],
    featured: true,
  },
  {
    slug: 'estate-coffee-placeholder-3',
    status: 'placeholder',
    name: 'Product name to be confirmed',
    summary: 'Placeholder for a third Glazebrooke product.',
    description: [
      'This is a placeholder product used to lay out the shop. Its name, description, sizes and price will be added once the estate confirms them.',
    ],
    photo: 'product-estate-coffee-placeholder-3',
    origin: 'Glazebrooke Coffee Estate, Yercaud, Tamil Nadu',
    variants: [],
    featured: true,
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
