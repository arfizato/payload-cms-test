import { asset } from '@/utilities/asset'

import type { Testimonial } from './types'

/**
 * Seed input only — transcribed from the design's "Témoignages clients"
 * section. The site reads the `testimonials` collection; this is what
 * /next/seed writes into an empty one.
 *
 * These quotes are the designer's placeholders, not real client statements.
 * They are attributed to real companies, so they must be replaced with approved
 * quotes in the admin before the site goes live.
 *
 * The first three carry client logos, as feedback asked; the last two are the
 * design's earlier portrait cards, kept so the carousel has something to
 * scroll to.
 */
export const testimonialsPlaceholder: Testimonial[] = [
  {
    quote:
      'BigArt a transformé nos bureaux en un espace moderne, fonctionnel et fidèle à notre identité.',
    author: 'Emna A.',
    role: 'COO chez Ooredoo',
    image: {
      src: asset('/testimonial-ooredoo.webp'),
      alt: 'Ooredoo',
      kind: 'logo',
      width: 96,
      height: 96,
    },
  },
  {
    quote:
      'Des propositions personnalisées, une belle qualité de finition et une réelle attention aux détails.',
    author: 'Jennifer L.',
    role: 'COO chez PwC',
    image: {
      src: asset('/testimonial-pwc.webp'),
      alt: 'PwC',
      kind: 'logo',
      width: 124,
      height: 96,
    },
  },
  {
    quote:
      'Un suivi professionnel de la conception à l’installation, avec un résultat conforme à nos attentes.',
    author: 'Ahmed H.',
    role: 'COO chez EY',
    image: {
      src: asset('/testimonial-ey.webp'),
      alt: 'EY',
      kind: 'logo',
      width: 96,
      height: 96,
    },
  },
  {
    quote:
      'Une équipe à l’écoute, des solutions adaptées à nos besoins et un accompagnement de qualité.',
    author: 'Sam B.',
    role: 'Responsable des achats',
    image: {
      src: asset('/testimonial-sam.webp'),
      alt: 'Sam B.',
      kind: 'avatar',
      width: 224,
      height: 224,
    },
  },
  {
    quote: 'Une signalétique soignée qui renforce notre image de marque et valorise nos espaces.',
    author: 'Jack R.',
    role: 'Responsable communication',
    image: {
      src: asset('/testimonial-jack.webp'),
      alt: 'Jack R.',
      kind: 'avatar',
      width: 224,
      height: 224,
    },
  },
]
