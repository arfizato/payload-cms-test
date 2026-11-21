import type { CollectionConfig } from 'payload'

import { adminOnly, canEdit, hideUnless } from '@/access'
import { GROUP, ORDER } from '@/admin/i18n'
import { logCollectionChange, logCollectionDelete } from '@/hooks/logActivity'
import { revalidateHomeCollection } from '@/hooks/revalidateHome'

/**
 * The team — "Notre équipe" on the homepage (the first four) and on À propos
 * (everyone, eight at a time behind "Voir plus").
 *
 * A collection because people join and leave. The section headings stay in code,
 * in the pages, as for the other sections' chrome.
 */
export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: {
    singular: { fr: 'Membre de l’équipe', en: 'Team member' },
    plural: { fr: 'Équipe', en: 'Team' },
  },
  access: {
    read: () => true,
    create: canEdit('team-members'),
    update: canEdit('team-members'),
    readVersions: canEdit('team-members'),
    delete: adminOnly,
  },
  admin: {
    group: GROUP.content,
    hidden: hideUnless('team-members'),
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order', 'updatedAt'],
    description: {
      fr: 'Visible sur : la page d’accueil (les quatre premiers selon l’ordre d’affichage) et la page À propos (tout le monde, huit par huit avec « Voir plus »).',
      en: 'Visible on: the homepage (the first four by display order) and the À propos page (everyone, eight at a time behind "Voir plus").',
    },
  },
  hooks: {
    afterChange: [revalidateHomeCollection, logCollectionChange],
    afterDelete: [logCollectionDelete],
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: { fr: 'Nom', en: 'Name' },
          admin: {
            width: '50%',
            placeholder: 'Linda Fakhfakh',
            description: {
              fr: 'Sert aussi de texte alternatif à la photo.',
              en: 'Also used as the photo’s alt text.',
            },
          },
        },
        {
          name: 'role',
          type: 'text',
          label: { fr: 'Fonction', en: 'Role' },
          admin: { width: '50%', placeholder: 'Fondatrice & CEO' },
        },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { fr: 'Photo', en: 'Photo' },
      admin: {
        description: {
          fr: 'Affichée en carré, le nom par-dessus en bas : visage centré, rien d’important dans le tiers inférieur. 800 × 800 px suffisent.',
          en: 'Shown square with the name over the bottom: centre the face, nothing important in the lower third. 800 × 800px is plenty.',
        },
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: ORDER.label,
      admin: {
        position: 'sidebar',
        description: ORDER.description,
      },
    },
  ],
}
