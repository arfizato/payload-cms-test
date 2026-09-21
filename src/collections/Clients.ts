import type { CollectionConfig } from 'payload'

import { adminOnly, canEdit, hideUnless } from '@/access'
import { GROUP, ORDER } from '@/admin/i18n'
import { logCollectionChange, logCollectionDelete } from '@/hooks/logActivity'
import { revalidateHomeCollection } from '@/hooks/revalidateHome'

/**
 * Client logos for the marquee strip under the hero.
 *
 * A collection because this is the content that changes most often on the page —
 * winning clients is the business. It was five entries hardcoded in
 * `ClientLogos/placeholder.ts` pointing at files uploaded to R2 by hand, so
 * adding one meant a developer, a commit and a deploy.
 */
export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: {
    singular: 'Client',
    plural: 'Clients',
  },
  access: {
    read: () => true,
    create: canEdit('clients'),
    update: canEdit('clients'),
    readVersions: canEdit('clients'),
    delete: adminOnly,
  },
  admin: {
    group: GROUP.content,
    hidden: hideUnless('clients'),
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'updatedAt'],
    description: {
      fr: 'Visible sur : le bandeau de logos sous la bannière, présent sur toutes les pages.',
      en: 'Visible on: the logo strip under the banner, on every page.',
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
      name: 'name',
      type: 'text',
      required: true,
      label: { fr: 'Nom', en: 'Name' },
      admin: {
        placeholder: 'Inetum',
        description: {
          fr: 'Sert aussi de texte alternatif au logo (lu par les lecteurs d’écran et Google).',
          en: 'Also used as the logo’s alt text (read by screen readers and Google).',
        },
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Logo',
      admin: {
        description: {
          fr: 'Le bandeau affiche tous les logos à la même hauteur : importez-le recadré au plus près, car des marges en trop le font paraître plus petit que ses voisins. PNG transparent ou SVG.',
          en: 'The strip shows every logo at the same height, so upload it trimmed tight — extra margins make it look smaller than its neighbours. Transparent PNG or SVG.',
        },
      },
    },
    {
      name: 'website',
      type: 'text',
      label: { fr: 'Site web', en: 'Website' },
      admin: {
        placeholder: 'https://…',
        description: {
          fr: 'Facultatif. Rend le logo cliquable.',
          en: 'Optional. Makes the logo clickable.',
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
