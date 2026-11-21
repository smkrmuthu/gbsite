/** Navigation and shared settings for the main brand site. */
import { shopUrl } from '@glazebrooke/brand/lib/links';
import type { NavItem } from '@glazebrooke/brand/components/Header.astro';

export const SITE_NAME = 'Glazebrooke Coffee Estate';
export const DESCRIPTOR = 'Coffee Estate';

/** "Our Brand" keeps the existing /beyond-coffee/ URL from the previous site. */
export const nav: NavItem[] = [
  { href: '/beyond-coffee/', label: 'Our brand' },
  { href: '/our-estate/', label: 'Our estate' },
  { href: '/our-coffee/', label: 'Our coffee' },
  { href: '/sustainability/', label: 'Sustainability' },
  { href: '/our-people/', label: 'Our people' },
  { href: '/contact/', label: 'Contact' },
];

export const buyCta = { href: shopUrl('/'), label: 'Buy coffee', track: 'shop_click' };

export const footerNav: NavItem[] = [{ href: '/', label: 'Home' }, ...nav];

export const crossLink = {
  href: shopUrl('/'),
  label: 'Visit the shop',
  note: 'Browse Glazebrooke coffee and see how to order.',
  track: 'shop_click',
};
