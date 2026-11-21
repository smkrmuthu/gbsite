/** Navigation and shared settings for the shop. */
import { mainUrl } from '@glazebrooke/brand/lib/links';
import type { NavItem } from '@glazebrooke/brand/components/Header.astro';

export const SITE_NAME = 'Glazebrooke Coffee Shop';
export const DESCRIPTOR = 'Coffee Shop';

export const nav: NavItem[] = [
  { href: '/products/', label: 'Shop all' },
  { href: '/about-our-coffee/', label: 'About our coffee' },
  { href: '/contact/', label: 'Contact' },
];

export const estateCta = { href: mainUrl('/'), label: 'The estate', track: 'estate_click' };

export const footerNav: NavItem[] = [{ href: '/', label: 'Shop home' }, ...nav];

export const crossLink = {
  href: mainUrl('/beyond-coffee/'),
  label: 'Visit the estate',
  note: 'Read the story of Glazebrooke Coffee Estate in Yercaud.',
  track: 'estate_click',
};
