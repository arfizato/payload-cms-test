import type { GlobalConfig } from 'payload'

import { canEdit, hideUnless } from '@/access'
import { GROUP } from '@/admin/i18n'
import { logGlobalChange } from '@/hooks/logActivity'
import { revalidateHomeGlobal } from '@/hooks/revalidateHome'

/**
 * Chrome for the expertises section — the label and the heading.
 *
 * The entries themselves live in the `services` collection, not here. They moved
 * out when projects needed to tag themselves with them: as rows in an array they
 * would have been duplicated as free text on every project and drifted the moment
 * someone typed "Signalitique".
 *
 * A global because there is exactly one of these headings on the homepage.
 */
export const ExpertisesGlobal: GlobalConfig = {
  slug: 'expertises',
  label: { fr: 'Nos métiers (titre)', en: 'Nos métiers (heading)' },
  access: {
    read: () => true,
    update: canEdit('expertises'),
    readVersions: canEdit('expertises'),
  },
  admin: {
    group: GROUP.home,
    hidden: hideUnless('expertises'),
    description: {
      fr: 'Visible sur : la page d’accueil uniquement — le titre au-dessus de la section Nos métiers. Les métiers eux-mêmes se modifient dans Contenu → Métiers.',
      en: 'Visible on: the homepage only — the heading above the Nos métiers section. The services themselves are edited in Content → Services.',
    },
    components: {
      elements: {
        beforeDocumentControls: [
          {
            path: '@/components/admin/PublishStatus#PublishStatus',
            clientProps: { globalSlug: 'expertises' },
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
      name: 'badge',
      type: 'text',
      label: { fr: 'Surtitre', en: 'Label above the heading' },
      defaultValue: 'Nos métiers',
    },
    {
      name: 'headingLines',
      type: 'array',
      label: { fr: 'Titre', en: 'Heading' },
      maxRows: 3,
      labels: {
        singular: { fr: 'Ligne', en: 'Line' },
        plural: { fr: 'Lignes', en: 'Lines' },
      },
      admin: {
        description: {
          fr: 'Chaque ligne ajoutée ici s’affiche sur sa propre ligne à l’écran, quelle que soit la taille de l’écran.',
          en: 'Each line added here shows on its own line on screen, whatever the screen size.',
        },
      },
      defaultValue: [{ text: 'Six expertises.' }, { text: 'Une seule équipe.' }],
      fields: [
        { name: 'text', type: 'text', required: true, label: { fr: 'Texte', en: 'Text' } },
      ],
    },
  ],
}
