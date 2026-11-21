import type { Testimonial as PayloadTestimonial } from '@/payload-types'

import type { TestimonialsProps } from './types'

/**
 * The section heading. Code, not content — same decision as `CHROME` in
 * Projects/adapt.ts (see backlog item 18).
 *
 * The design's lede here repeated the team section's text ("Plus de 20
 * experts…"), which does not describe testimonials, so there is none until real
 * copy exists.
 */
const CHROME = {
  badge: 'Témoignages clients',
  titleLines: ['Ils nous font confiance'],
}

/**
 * Payload documents → component props.
 *
 * The image is optional: a testimonial without one, or whose upload is not
 * populated, still shows — just without a logo or portrait beside the name.
 */
export const adaptTestimonials = (docs: PayloadTestimonial[]): TestimonialsProps => ({
  ...CHROME,
  items: docs.map((doc) => {
    const media = typeof doc.image === 'object' && doc.image !== null ? doc.image : null
    const kind = doc.imageKind === 'avatar' ? 'avatar' : 'logo'

    return {
      quote: doc.quote,
      author: doc.author,
      role: doc.role ?? undefined,
      rating: doc.rating ?? 5,
      image: media?.url
        ? {
            src: media.url,
            // A logo's alt names the company; the role line carries it when the
            // upload has no alt of its own.
            alt: media.alt || doc.role || doc.author,
            kind,
            width: media.width ?? 96,
            height: media.height ?? 96,
          }
        : undefined,
    }
  }),
})
