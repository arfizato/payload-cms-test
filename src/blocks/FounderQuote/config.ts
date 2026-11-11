import type { GlobalConfig } from 'payload'

import { canEdit, hideUnless } from '@/access'
import { GROUP, OPTIONAL } from '@/admin/i18n'
import { logGlobalChange } from '@/hooks/logActivity'
import { revalidateHomeGlobal } from '@/hooks/revalidateHome'

/**
 * Editable source for the founder's quote on À propos.
 *
 * A global: there is exactly one of these, with fixed slots. The surrounding
 * band — the outline, the lattice, the squares — is design and stays in the
 * component; only the words and who said them are editable.
 */
export const FounderQuoteGlobal: GlobalConfig = {
  slug: 'founder-quote',
  label: { fr: 'Citation fondatrice', en: 'Founder quote' },
  access: {
    read: () => true,
    update: canEdit('founder-quote'),
    readVersions: canEdit('founder-quote'),
  },
  admin: {
    group: GROUP.about,
    hidden: hideUnless('founder-quote'),
    description: {
      fr: 'Visible sur : la page À propos — la citation encadrée sur fond noir.',
      en: 'Visible on: the À propos page — the outlined quote on the black band.',
    },
    components: {
      elements: {
        beforeDocumentControls: [
          {
            path: '@/components/admin/PublishStatus#PublishStatus',
            clientProps: { globalSlug: 'founder-quote' },
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
      name: 'quote',
      type: 'textarea',
      required: true,
      label: { fr: 'Citation', en: 'Quote' },
      admin: {
        description: {
          fr: 'Sans guillemets : le cadre fait déjà le travail. Quatre à six lignes environ.',
          en: 'No quote marks — the frame already does that. Roughly four to six lines.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'authorName',
          type: 'text',
          required: true,
          label: { fr: 'Nom', en: 'Name' },
          admin: { width: '50%', placeholder: 'Linda Fakhfakh' },
        },
        {
          name: 'authorRole',
          type: 'text',
          label: { fr: 'Fonction', en: 'Role' },
          admin: {
            width: '50%',
            placeholder: 'Fondatrice & CEO, Groupe BigArt',
            description: OPTIONAL,
          },
        },
      ],
    },
  ],
}
