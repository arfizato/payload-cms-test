import type { Expertise as PayloadExpertises, Service as PayloadService } from '@/payload-types'
import { metierHref } from '@/utilities/metierAnchor'

import type { ExpertisesProps } from './types'

/**
 * Payload documents → component props.
 *
 * Takes two sources: the global owns the section's label and heading, the
 * `services` collection owns the entries. They were one document until projects
 * needed to tag themselves with the entries.
 *
 * The shapes diverge in three places, which is why this exists rather than
 * spreading the documents straight in:
 *   - `image` comes back as a Media object (or a bare id at depth 0)
 *   - the link is two flat fields, not a nested object
 *   - `headingLines` is an array of rows, not an array of strings
 */
export const adaptExpertises = (
  doc: PayloadExpertises,
  services: PayloadService[],
): ExpertisesProps => ({
  badge: doc.badge ?? undefined,
  headingLines: (doc.headingLines ?? [])
    .map((row) => row.text)
    .filter((text): text is string => Boolean(text)),
  items: services.flatMap((service) => {
    // depth 0 returns an id; without a populated upload there is nothing to show.
    const media = typeof service.image === 'object' && service.image !== null ? service.image : null
    if (!media?.url) return []

    return [
      {
        title: service.title,
        description: service.description ?? undefined,
        // '#' is the field's default, meaning "not set". Unset, the link goes
        // to this métier's own row on /metiers rather than nowhere — the
        // homepage teaser should lead to the full description.
        link: service.linkLabel
          ? {
              label: service.linkLabel,
              href:
                service.linkHref && service.linkHref !== '#'
                  ? service.linkHref
                  : metierHref(service.title),
            }
          : undefined,
        image: {
          src: media.url,
          alt: media.alt || service.title,
          caption: service.caption ?? undefined,
        },
      },
    ]
  }),
})
