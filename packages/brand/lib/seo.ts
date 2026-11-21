import { brand } from '../config/brand.config';
import { MAIN_SITE_URL, SHOP_URL } from './env';

type JsonLd = Record<string, unknown>;

const ORG_ID = `${MAIN_SITE_URL}/#organization`;

/**
 * Organization: only verified-level fields. Address is limited to locality,
 * region and country (no street address, phone or geo coordinates until the
 * estate confirms them). `foundingDate` is omitted because only a decade is known.
 */
export function organizationSchema(): JsonLd {
  const sameAs = brand.social.map((s) => s.url).filter(Boolean);
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: brand.name,
    url: `${MAIN_SITE_URL}/`,
    ...(brand.logo ? { logo: `${MAIN_SITE_URL}${brand.logo.schema}` } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: brand.location.locality,
      addressRegion: brand.location.region,
      addressCountry: brand.location.countryCode,
    },
    ...(brand.contact.email ? { email: brand.contact.email } : {}),
    ...(brand.contact.phone ? { telephone: brand.contact.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema(site: 'main' | 'shop'): JsonLd {
  const url = site === 'main' ? MAIN_SITE_URL : SHOP_URL;
  return {
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    url: `${url}/`,
    name: site === 'main' ? brand.name : `${brand.shopName} shop`,
    inLanguage: brand.lang,
    publisher: { '@id': ORG_ID },
  };
}

export function webPageSchema(opts: { url: string; name: string; description: string; site: 'main' | 'shop' }): JsonLd {
  const base = opts.site === 'main' ? MAIN_SITE_URL : SHOP_URL;
  return {
    '@type': 'WebPage',
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: brand.lang,
    isPartOf: { '@id': `${base}/#website` },
    about: { '@id': ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Wrap one or more nodes in a single @graph document. */
export function graph(...nodes: JsonLd[]): JsonLd {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export { ORG_ID };
