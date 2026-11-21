import { asset } from '@/utilities/asset'

import type { TeamMember, TeamProps } from './types'

/**
 * The four people the design names, in the design's order.
 *
 * A team is many people the client adds and removes, so the kind is a
 * collection (docs/content-architecture.md). Not wired yet — this is the
 * design-first pass.
 *
 * The photographs are the design's stock portraits, not these people. The
 * design repeats the four names to fill two rows; that is not repeated here,
 * so /a-propos shows four cards and no "Voir plus" until there are more than
 * eight real members.
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

/** The homepage teaser, chrome transcribed from the design. */
export const teamHomePlaceholder: TeamProps = {
  badge: 'Notre équipe',
  titleLines: ['Les personnes', 'derrière vos projets.'],
  lede: 'Plus de 20 experts avec une moyenne de 10 ans d’expérience dans l’espace professionnel, entièrement dédiés à la réussite de votre projet.',
  members: teamMembersPlaceholder,
  variant: 'teaser',
  cta: { label: 'Découvrir toute l’équipe', href: '/a-propos#equipe' },
}
