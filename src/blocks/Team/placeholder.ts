import { asset } from '@/utilities/asset'

import type { TeamMember } from './types'

/**
 * Seed input only — the four people the design names, in the design's order.
 * The site reads the `team-members` collection; this is what /next/seed writes
 * into an empty one.
 *
 * The photographs are the design's stock portraits, not these people — replace
 * them in the admin. The design repeats the four names to fill two rows; that
 * is not repeated here, so /a-propos shows four cards and no "Voir plus" until
 * there are more than eight members.
 */
export const teamMembersPlaceholder: TeamMember[] = [
  {
    name: 'Linda Fakhfakh',
    role: 'Fondatrice & CEO',
    photo: { src: asset('/team-linda.webp'), alt: 'Linda Fakhfakh' },
  },
  {
    name: 'Sameh Jemai',
    role: 'Assistance de direction',
    photo: { src: asset('/team-sameh.webp'), alt: 'Sameh Jemai' },
  },
  {
    name: 'Oumayma Abdelkefi',
    role: 'Coordinatrice & Directrice production',
    photo: { src: asset('/team-oumayma.webp'), alt: 'Oumayma Abdelkefi' },
  },
  {
    name: 'Mehdi Hadhri',
    role: 'Project Manager',
    photo: { src: asset('/team-mehdi.webp'), alt: 'Mehdi Hadhri' },
  },
]
