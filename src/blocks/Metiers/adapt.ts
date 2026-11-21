import type { Media, Service as PayloadService } from '@/payload-types'
import { metierAnchor } from '@/utilities/metierAnchor'

import type { MetierPhoto, MetiersProps } from './types'

/** An upload comes back as a bare id at depth 0; only a populated one has a url. */
const toPhoto = (
  value: number | Media | null | undefined,
  fallbackAlt: string,
  caption?: string | null,
): MetierPhoto[] => {
  const media = typeof value === 'object' && value !== null ? value : null
  if (!media?.url) return []

  return [{ src: media.url, alt: media.alt || fallbackAlt, caption: caption ?? undefined }]
}

/**
 * Services collection → the rows on /metiers.
 *
 * The carousel reads `gallery`, and falls back to the single `image` when the
 * gallery is empty. That fallback is what lets the section ship before anyone has
 * uploaded a second photo: every existing métier already has a main photo, so the
 * page renders today and gains a working carousel the moment the client adds to
 * the gallery.
 *
 * A métier with no usable photo at all is dropped rather than rendered as an
 * empty frame — same rule as `adaptExpertises`.
 */
export const adaptMetiers = (services: PayloadService[]): MetiersProps => ({
  items: services.flatMap((service) => {
    const gallery = (service.gallery ?? []).flatMap((row) =>
      toPhoto(row.image, service.title, row.caption),
    )

    const photos =
      gallery.length > 0 ? gallery : toPhoto(service.image, service.title, service.caption)
    if (photos.length === 0) return []

    // '#' is the field's default, which means "not set yet" rather than a link.
    const href = service.linkHref && service.linkHref !== '#' ? service.linkHref : undefined

    return [
      {
        title: service.title,
        anchor: metierAnchor(service.title),
        description: service.description ?? undefined,
        href,
        photos,
      },
    ]
  }),
})
