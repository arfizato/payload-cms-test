/**
 * The sections an editor can be given permission to edit.
 *
 * A value is the collection or global slug it controls, so `canEdit('projects')`
 * and the checkbox an admin ticks are the same string — a typo is a type error
 * rather than a permission that silently never matches.
 *
 * Adding a collection or global means adding it here, or nobody but an admin
 * will ever be able to edit it.
 *
 * Médias and Utilisateurs are deliberately absent: uploading is open to every
 * editor and managing users is admin-only, so neither is a ticked box.
 */
export const SECTIONS = [
  { value: 'projects', label: { fr: 'Réalisations', en: 'Projects' } },
  { value: 'services', label: { fr: 'Métiers', en: 'Services' } },
  { value: 'clients', label: { fr: 'Clients', en: 'Clients' } },
  { value: 'expertises', label: { fr: 'Nos métiers (titre)', en: 'Nos métiers (heading)' } },
  { value: 'stats', label: { fr: 'Chiffres clés', en: 'Key figures' } },
  { value: 'footer', label: { fr: 'Pied de page', en: 'Footer' } },
  { value: 'site-info', label: { fr: 'Coordonnées', en: 'Contact details' } },
] as const

export type SectionSlug = (typeof SECTIONS)[number]['value']
