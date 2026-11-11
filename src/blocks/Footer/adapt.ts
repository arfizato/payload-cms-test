import { asset } from '@/utilities/asset'
import type {
  Footer as PayloadFooter,
  Service as PayloadService,
  SiteInfo as PayloadSiteInfo,
} from '@/payload-types'

import type { FooterProps, SocialPlatform } from './types'

/**
 * Payload documents → component props.
 *
 * Three sources: the footer global owns the copy and links, the `services`
 * collection owns the "Nos métiers" column, and `site-info` owns the contact
 * lines. Neither of the last two is a footer field — the address and the métiers
 * are each written once and appear wherever they are used.
 */
export const adaptFooter = (
  doc: PayloadFooter,
  services: PayloadService[],
  siteInfo: PayloadSiteInfo,
): FooterProps => ({
  brand: {
    src: asset('/logo.webp'),
    alt: 'BigArt Group',
    width: 122,
    height: 52,
  },
  tagline: doc.tagline ?? undefined,
  socials: (doc.socials ?? []).flatMap((row) =>
    row.platform && row.url
      ? [{ platform: row.platform as SocialPlatform, url: row.url }]
      : [],
  ),
  navTitle: doc.navTitle ?? undefined,
  navLinks: (doc.navLinks ?? []).flatMap((row) =>
    row.label && row.href ? [{ label: row.label, href: row.href }] : [],
  ),
  servicesTitle: doc.servicesTitle ?? undefined,
  services: services.map((service) => ({
    label: service.title,
    // No per-métier detail pages yet, and the Metiers block renders one section
    // for all of them rather than an anchor each, so every row points at the
    // métiers page itself rather than the homepage expertises section.
    href: '/metiers',
  })),
  contactTitle: doc.contactTitle ?? undefined,
  // `inFooter` lets an editor keep opening hours out of the footer while still
  // showing them in the contact section.
  contactLines: (siteInfo.details ?? []).flatMap((row) =>
    row.value && row.inFooter !== false ? [row.value] : [],
  ),
  legal: doc.legal ?? undefined,
})
