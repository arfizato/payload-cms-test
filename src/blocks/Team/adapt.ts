import type { TeamMember as PayloadTeamMember } from '@/payload-types'

import type { TeamMember } from './types'

/**
 * Payload documents → the members list both pages render.
 *
 * Only the people: each page supplies its own heading and decides how many to
 * show. A member whose photo is not populated is dropped rather than rendered
 * as an empty square, same rule as the other adapters.
 */
export const adaptTeamMembers = (docs: PayloadTeamMember[]): TeamMember[] =>
  docs.flatMap((doc) => {
    const media = typeof doc.photo === 'object' && doc.photo !== null ? doc.photo : null
    if (!media?.url) return []

    return [
      {
        name: doc.name,
        role: doc.role ?? undefined,
        photo: { src: media.url, alt: media.alt || doc.name },
      },
    ]
  })
