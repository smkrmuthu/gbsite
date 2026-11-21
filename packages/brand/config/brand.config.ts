/**
 * Glazebrooke brand configuration: the single place for contact details,
 * ordering routes, social links and other owner-supplied facts.
 *
 * RULE: only enter details the estate has confirmed. An empty string or empty
 * array hides the related UI automatically, so nothing invented ever goes live.
 * Run `npm run content:status` to list everything still missing.
 *
 * Domains and analytics IDs are deployment settings, so they live in
 * environment variables (see `.env.example` and `lib/env.ts`), not here.
 */

export type SocialNetwork = 'instagram' | 'facebook' | 'youtube' | 'linkedin' | 'x' | 'pinterest';

export interface SocialLink {
  network: SocialNetwork;
  /** Full profile URL, e.g. https://www.instagram.com/<handle>/ */
  url: string;
  /** Handle without @ (used for X/Twitter card metadata when network is 'x'). */
  handle?: string;
}

export const brand = {
  /** Legal/brand name used in titles, schema.org and the footer. */
  name: 'Glazebrooke Coffee Estate',
  shortName: 'Glazebrooke',
  shopName: 'Glazebrooke Coffee',
  lang: 'en-IN',
  ogLocale: 'en_IN',

  /**
   * Location at locality level. Yercaud (Salem district, Tamil Nadu) is the
   * location given for the estate in the project brief. Add a full postal
   * address under `contact.address` only once confirmed by the estate.
   */
  location: {
    locality: 'Yercaud',
    district: 'Salem',
    region: 'Tamil Nadu',
    country: 'India',
    countryCode: 'IN',
    hills: 'Shevaroy Hills',
  },

  contact: {
    /** Public enquiries email, e.g. hello@glazebrookecoffee.com — NOT CONFIRMED YET. */
    email: '',
    /** Public phone in international format, e.g. +91 00000 00000 — NOT CONFIRMED YET. */
    phone: '',
    /** Full postal address lines — NOT CONFIRMED YET. */
    address: [] as string[],
    /** Google Maps / OpenStreetMap link to the estate — NOT CONFIRMED YET. */
    mapUrl: '',
    /**
     * Optional form-handling endpoint (Formspree, Web3Forms, Basin, a custom
     * API…). When set, the contact form POSTs here. When empty, the form opens
     * the visitor's email app addressed to `contact.email` instead; when both
     * are empty the form is not shown at all.
     */
    formEndpoint: '',
  },

  ordering: {
    /**
     * WhatsApp number for orders, digits only with country code, no "+",
     * e.g. '919800000000'. NOT CONFIRMED YET.
     */
    whatsappNumber: '',
    /**
     * Optional external ordering page (marketplace, Shopify checkout, etc.).
     * When set, it takes priority over WhatsApp for "Order" buttons.
     */
    externalUrl: '',
    /** Short name of the external service, shown to visitors: e.g. 'our Amazon store'. */
    externalLabel: '',
  },

  /** Official social profiles. Leave empty until each URL is confirmed. */
  social: [] as SocialLink[],

  /**
   * Official logo, supplied from the previous website (November 2026) as a
   * white-on-transparent PNG. Files live in BOTH apps/main/public/ and
   * apps/shop/public/:
   *   logo-white.png  : original artwork (dark backgrounds: footer)
   *   logo-forest.png : same artwork recoloured to brand forest green (cream header)
   *   logo.png        : forest version padded on white (schema.org Organization logo)
   * Replace with vector (SVG) artwork when available. Set to null to fall
   * back to the typographic wordmark.
   */
  logo: {
    onLight: '/logo-forest.png',
    onDark: '/logo-white.png',
    schema: '/logo.png',
    width: 480,
    height: 86,
  } as { onLight: string; onDark: string; schema: string; width: number; height: number } | null,
};

export type Brand = typeof brand;
