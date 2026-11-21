import { asset } from '@/utilities/asset'

import type { TestimonialsProps } from './types'

/**
 * Mock content, transcribed from the design's "Témoignages clients" section.
 *
 * Testimonials are many and the client will add them, so the kind is a
 * collection (docs/content-architecture.md, "Decide the kind before
 * designing"). Not wired yet: this is the design-first pass, and these quotes
 * are the designer's placeholders, not real client statements — they need
 * replacing with approved quotes before the section goes live.
 *
 * The first three carry client logos, as feedback asked; the last two are the
 * design's earlier portrait cards, kept so the carousel has something to
 * scroll to.
 *
 * The design's lede under the heading repeated the team section's copy
 * ("Plus de 20 experts…"), which does not describe testimonials, so it is
 * left out until there is real copy for it.
 */
export const testimonialsPlaceholder: TestimonialsProps = {
  badge: 'Témoignages clients',
  titleLines: ['Ils nous font confiance'],
  items: [
    {
      quote: 'BigArt a transformé nos bureaux en un espace moderne, fonctionnel et fidèle à notre identité.',
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
        width: 112,
        height: 112,
      },
    },
    {
      quote:
        'Une signalétique soignée qui renforce notre image de marque et valorise nos espaces.',
      author: 'Jack R.',
      role: 'Responsable communication',
      image: {
        src: asset('/testimonial-jack.webp'),
        alt: 'Jack R.',
        kind: 'avatar',
        width: 112,
        height: 112,
      },
    },
  ],
}
