import type { Certification as PayloadCertifications } from '@/payload-types'

import type { CertificationsProps } from './types'

/**
 * Payload document → component props.
 *
 * `headingLines` is an array of rows rather than a multiline string, the same
 * shape the Expertises global uses, so the line break is a row an editor can
 * drag rather than a newline they cannot see.
 *
 * Rows missing a brand or a heading are dropped rather than rendered as an
 * untitled card.
 */
export const adaptCertifications = (doc: PayloadCertifications): CertificationsProps => ({
  badge: doc.badge ?? undefined,
  titleLines: (doc.headingLines ?? []).flatMap((row) => (row.text ? [row.text] : [])),
  lede: doc.lede ?? undefined,
  items: (doc.items ?? []).flatMap((row) => {
    if (!row.brand || !row.heading) return []

    return [
      {
        brand: row.brand,
        heading: row.heading,
        body: row.body ?? '',
        certification: row.certification ?? undefined,
      },
    ]
  }),
})
