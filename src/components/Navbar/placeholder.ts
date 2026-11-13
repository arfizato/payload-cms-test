import { asset } from '@/utilities/asset'

import type { NavbarProps } from './types'

/**
 * Stand-in content until the Header global is wired.
 * Reusable afterwards as seed data — see docs/content-architecture.md.
 */
export const navbarPlaceholder: NavbarProps = {
  brand: {
    src: asset('/logo.webp'),
    alt: 'BigArt Group',
    width: 122,
    height: 52,
    href: '/',
  },
  links: [
    { label: 'À propos', href: '/a-propos' },
    { label: 'Nos métiers', href: '/metiers' },
    { label: 'Nos projets', href: '/projets' },
    { label: 'Actualités', href: '#actualites' },
  ],
  cta: { label: 'Parlons de votre projet', href: '/contact' },
}
