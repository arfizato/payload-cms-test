import type { CollectionSlug, GlobalSlug } from 'payload'

/**
 * The admin sidebar's layout: one group per page of the site, and inside it one
 * entry per section of that page, in the order they appear on screen.
 *
 * A section that appears on several pages (the footer, the client logos) is listed
 * under each of them and opens the same document — editing it once changes every
 * page.
 *
 * Only editable sections are listed. Navbar, Hero and News are hardcoded (see
 * docs/backlog.md), so they have nothing to open.
 *
 * Collections and globals not listed here — Médias, Utilisateurs, Journal — keep
 * their usual `admin.group` below the pages.
 */

type Label = { fr: string; en: string }

export type PageSection = { label: Label } & (
  | { type: 'collection'; slug: CollectionSlug }
  | { type: 'global'; slug: GlobalSlug }
)

export type SitePage = {
  label: Label
  sections: PageSection[]
}

const clients: PageSection = {
  label: { fr: 'Clients', en: 'Clients' },
  type: 'collection',
  slug: 'clients',
}

const projects: PageSection = {
  label: { fr: 'Réalisations', en: 'Projects' },
  type: 'collection',
  slug: 'projects',
}

const stats: PageSection = {
  label: { fr: 'Chiffres clés', en: 'Key figures' },
  type: 'global',
  slug: 'stats',
}

const contact: PageSection = {
  label: { fr: 'Contact', en: 'Contact' },
  type: 'global',
  slug: 'site-info',
}

const team: PageSection = {
  label: { fr: 'Équipe', en: 'Team' },
  type: 'collection',
  slug: 'team-members',
}

const footer: PageSection = {
  label: { fr: 'Pied de page', en: 'Footer' },
  type: 'global',
  slug: 'footer',
}

export const SITE_PAGES: SitePage[] = [
  {
    label: { fr: 'Page d’accueil', en: 'Homepage' },
    sections: [
      clients,
      stats,
      // The Expertises section reads two documents: its heading, and the métiers it lists.
      {
        label: { fr: 'Nos métiers — titre', en: 'Nos métiers — heading' },
        type: 'global',
        slug: 'expertises',
      },
      {
        label: { fr: 'Nos métiers — liste', en: 'Nos métiers — list' },
        type: 'collection',
        slug: 'services',
      },
      projects,
      {
        label: { fr: 'Témoignages', en: 'Testimonials' },
        type: 'collection',
        slug: 'testimonials',
      },
      team,
      contact,
      footer,
    ],
  },
  {
    label: { fr: 'Nos projets', en: 'Nos projets' },
    sections: [clients, projects, contact, footer],
  },
  {
    label: { fr: 'Nos métiers', en: 'Nos métiers' },
    sections: [
      clients,
      { label: { fr: 'Métiers', en: 'Services' }, type: 'collection', slug: 'services' },
      contact,
      footer,
    ],
  },
  {
    label: { fr: 'À propos', en: 'À propos' },
    sections: [
      clients,
      {
        label: { fr: 'Citation fondatrice', en: 'Founder quote' },
        type: 'global',
        slug: 'founder-quote',
      },
      {
        label: { fr: 'Produits certifiés', en: 'Certified products' },
        type: 'global',
        slug: 'certifications',
      },
      team,
      stats,
      contact,
      footer,
    ],
  },
  {
    label: { fr: 'Contact', en: 'Contact' },
    sections: [clients, contact, footer],
  },
]
