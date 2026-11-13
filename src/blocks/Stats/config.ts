import type { GlobalConfig } from 'payload'

import { canEdit, hideUnless } from '@/access'
import { GROUP, OPTIONAL } from '@/admin/i18n'
import { logGlobalChange } from '@/hooks/logActivity'
import { revalidateHomeGlobal } from '@/hooks/revalidateHome'

/**
 * Editable source for the statistics band.
 *
 * A global: there is one of these, with fixed slots. Each row is one figure;
 * the number counts up on screen, so `value` must stay numeric — the prefix and
 * suffix exist so "+1k" is still a number the animation can run on.
 */
export const StatsGlobal: GlobalConfig = {
  slug: 'stats',
  label: { fr: 'Chiffres clés', en: 'Key figures' },
  access: {
    read: () => true,
    update: canEdit('stats'),
    readVersions: canEdit('stats'),
  },
  admin: {
    group: GROUP.home,
    hidden: hideUnless('stats'),
    description: {
      fr: 'Visible sur : la page d’accueil et la page À propos — la bande de chiffres.',
      en: 'Visible on: the homepage and the À propos page — the band of figures.',
    },
    components: {
      elements: {
        beforeDocumentControls: [
          {
            path: '@/components/admin/PublishStatus#PublishStatus',
            clientProps: { globalSlug: 'stats' },
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
    // 200ms fired five times a second and, with live preview's mergeData calls on
    // top, was enough to lose that race. 1s is imperceptible while editing.
    drafts: { autosave: { interval: 1000 }, schedulePublish: true },
    max: 30,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: { fr: 'Chiffres', en: 'Figures' },
      minRows: 1,
      maxRows: 8,
      labels: {
        singular: { fr: 'Chiffre', en: 'Figure' },
        plural: { fr: 'Chiffres', en: 'Figures' },
      },
      admin: {
        description: {
          fr: 'Affichés de gauche à droite dans la bande noire. Faites-les glisser pour changer l’ordre.',
          en: 'Shown left to right in the black band. Drag them to reorder.',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'prefix',
              type: 'text',
              label: { fr: 'Préfixe', en: 'Prefix' },
              admin: { width: '20%', placeholder: '+', description: OPTIONAL },
            },
            {
              name: 'value',
              type: 'number',
              required: true,
              label: { fr: 'Nombre', en: 'Number' },
              admin: {
                width: '30%',
                description: {
                  fr: 'Chiffres uniquement : c’est ce nombre qui s’anime.',
                  en: 'Digits only: this is the number that animates.',
                },
              },
            },
            {
              name: 'suffix',
              type: 'text',
              label: { fr: 'Suffixe', en: 'Suffix' },
              admin: { width: '20%', placeholder: 'k', description: OPTIONAL },
            },
            {
              name: 'decimals',
              type: 'number',
              label: { fr: 'Décimales', en: 'Decimals' },
              defaultValue: 0,
              min: 0,
              max: 2,
              admin: { width: '30%' },
            },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: { fr: 'Légende', en: 'Caption' },
          admin: { placeholder: 'ans d’expertise' },
        },
      ],
    },
  ],
}
