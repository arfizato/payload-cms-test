import type { GlobalConfig } from 'payload'

import { canEdit, hideUnless } from '@/access'
import { GROUP, OPTIONAL } from '@/admin/i18n'
import { logGlobalChange } from '@/hooks/logActivity'
import { revalidateHomeGlobal } from '@/hooks/revalidateHome'

/**
 * Editable source for "Exclusivités européennes" on À propos.
 *
 * A global: there is one of these. The brands themselves are rows rather than a
 * collection — nothing else on the site links to a brand, and they are read
 * only here, so a collection would buy a list view and an id for no gain.
 *
 * The card widths alternate narrow/wide by position, which is why the order of
 * the rows is a design decision and not just a sort.
 */
export const CertificationsGlobal: GlobalConfig = {
  slug: 'certifications',
  label: { fr: 'Produits certifiés', en: 'Certified products' },
  access: {
    read: () => true,
    update: canEdit('certifications'),
    readVersions: canEdit('certifications'),
  },
  admin: {
    group: GROUP.about,
    hidden: hideUnless('certifications'),
    description: {
      fr: 'Visible sur : la page À propos — les marques européennes distribuées en exclusivité.',
      en: 'Visible on: the À propos page — the exclusively distributed European brands.',
    },
    components: {
      elements: {
        beforeDocumentControls: [
          {
            path: '@/components/admin/PublishStatus#PublishStatus',
            clientProps: { globalSlug: 'certifications' },
          },
        ],
      },
    },
    livePreview: {
      // path=/preview keeps the editor off the public route, which is static.
      url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/next/preview?secret=${
        process.env.PREVIEW_SECRET || ''
      }&path=/preview`,
    },
  },
  hooks: {
    afterChange: [revalidateHomeGlobal, logGlobalChange],
  },
  versions: {
    drafts: { autosave: { interval: 1000 }, schedulePublish: true },
    max: 30,
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: { fr: 'Étiquette', en: 'Tag' },
      admin: { placeholder: 'Exclusivités européennes', description: OPTIONAL },
    },
    {
      name: 'headingLines',
      type: 'array',
      label: { fr: 'Titre', en: 'Heading' },
      minRows: 1,
      maxRows: 3,
      labels: {
        singular: { fr: 'Ligne', en: 'Line' },
        plural: { fr: 'Lignes', en: 'Lines' },
      },
      admin: {
        description: {
          fr: 'Une ligne par rangée : c’est la coupure du titre, pas un retour automatique.',
          en: 'One line per row: this is where the heading breaks, not a wrap.',
        },
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: { fr: 'Texte', en: 'Text' },
        },
      ],
    },
    {
      name: 'lede',
      type: 'textarea',
      label: { fr: 'Chapô', en: 'Lede' },
      admin: { description: OPTIONAL },
    },
    {
      name: 'items',
      type: 'array',
      label: { fr: 'Marques', en: 'Brands' },
      minRows: 1,
      maxRows: 8,
      labels: {
        singular: { fr: 'Marque', en: 'Brand' },
        plural: { fr: 'Marques', en: 'Brands' },
      },
      admin: {
        description: {
          fr: 'Deux cartes par rangée, en alternant large et étroite. Faites-les glisser pour changer l’ordre.',
          en: 'Two cards per row, alternating wide and narrow. Drag them to reorder.',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'brand',
              type: 'text',
              required: true,
              label: { fr: 'Marque', en: 'Brand' },
              admin: { width: '40%', placeholder: 'Solar Screen' },
            },
            {
              name: 'certification',
              type: 'text',
              label: { fr: 'Certification', en: 'Certification' },
              admin: {
                width: '60%',
                placeholder: 'Films certifiés EU',
                description: {
                  fr: 'Affichée dans le bandeau sombre au bas de la carte. Laissez vide pour masquer le bandeau.',
                  en: 'Shown in the dark strip at the foot of the card. Leave empty to hide the strip.',
                },
              },
            },
          ],
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          label: { fr: 'Titre', en: 'Heading' },
          admin: { placeholder: 'Belgique. Exclusivité Tunisie.' },
        },
        {
          name: 'body',
          type: 'textarea',
          label: { fr: 'Description', en: 'Description' },
        },
      ],
    },
  ],
}
