import { brand } from '../config/brand.config';
import { MAIN_SITE_URL, SHOP_URL } from './env';

const join = (base: string, path = '/') => base + (path.startsWith('/') ? path : `/${path}`);

/** Absolute URL on the shop domain (used by the main site's Buy Coffee links). */
export const shopUrl = (path = '/') => join(SHOP_URL, path);
/** Absolute URL on the main brand domain (used by the shop's estate links). */
export const mainUrl = (path = '/') => join(MAIN_SITE_URL, path);

export const mailto = (email: string, subject?: string) =>
  `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
export const tel = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

export interface OrderAction {
  href: string;
  label: string;
  /** Plain-language note shown next to the button: what happens on click. */
  explains: string;
  channel: 'external' | 'whatsapp' | 'email';
  newTab: boolean;
}

/**
 * Resolve how a visitor places an order, in priority order:
 * external ordering URL → WhatsApp → email. Returns null when the estate
 * has not configured any route yet.
 */
export function orderAction(productName?: string, productUrl?: string): OrderAction | null {
  const { ordering, contact } = brand;
  if (ordering.externalUrl) {
    return {
      href: ordering.externalUrl,
      label: 'Order online',
      explains: `Takes you to ${ordering.externalLabel || 'our ordering partner'} to complete your order.`,
      channel: 'external',
      newTab: false,
    };
  }
  const message = productName
    ? `Hello Glazebrooke, I would like to order: ${productName}.${productUrl ? ` (${productUrl})` : ''}`
    : 'Hello Glazebrooke, I would like to order some coffee.';
  if (ordering.whatsappNumber) {
    return {
      href: `https://wa.me/${ordering.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
      label: 'Order on WhatsApp',
      explains: 'Opens WhatsApp with a message to the estate already written. You can edit it before you send it.',
      channel: 'whatsapp',
      newTab: true,
    };
  }
  if (contact.email) {
    return {
      href: `mailto:${contact.email}?subject=${encodeURIComponent('Coffee order')}&body=${encodeURIComponent(message)}`,
      label: 'Order by email',
      explains: 'Opens your email app with an order message to the estate already written.',
      channel: 'email',
      newTab: false,
    };
  }
  return null;
}

export const socialLabel: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  x: 'X',
  pinterest: 'Pinterest',
};
