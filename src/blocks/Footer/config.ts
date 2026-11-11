import type { GlobalConfig } from 'payload'

import { canEdit, hideUnless } from '@/access'
import { GROUP } from '@/admin/i18n'
import { logGlobalChange } from '@/hooks/logActivity'
import { revalidateHomeGlobal } from '@/hooks/revalidateHome'

/**
 * Footer content.
 *
 * Two columns are deliberately absent from these fields:
 *   - "Nos métiers" reads from the `services` collection
 *   - "Contact" reads from the `site-info` global
 *
 * Both are edited in one place and appear wherever they are used, rather than
 * being retyped per section. Only their headings are editable here.
 */
export const FooterGlobal: GlobalConfig = {
  slug: 'footer',
  label: { fr: 'Pied de page', en: 'Footer' },
  access: {
    read: () => true,
    update: canEdit('footer'),
    readVersions: canEdit('footer'),
  },
  admin: {
    group: GROUP.site,
    hidden: hideUnless('footer'),
    description: {
      fr: 'Visible sur : le pied de page de toutes les pages. Les liens « Nos métiers » se remplissent tout seuls depuis la collection Métiers ; les coordonnées viennent de Coordonnées.',
      en: 'Visible on: the footer of every page. The « Nos métiers » links fill in automatically from the Services collection; the contact details come from Contact details.',
    },
    components: {
      elements: {
        beforeDocumentControls: [
          {
            path: '@/components/admin/PublishStatus#PublishStatus',
            clientProps: { globalSlug: 'footer' },
          },
        ],
      },
    },
    livePreview: {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/next/preview?secret=${
        process.env.PREVIEW_SECRET || ''
      }&path=/preview`,
    },
  },
  hooks: {
    afterChange: [revalidateHomeGlobal, logGlobalChange],
  },
  versions: {
    drafts: { autosave: { interval: 1000 } },
    max: 30,
  },
  fields: [
    {
      name: 'tagline',
      type: 'textarea',
      label: { fr: 'Texte sous le logo', en: 'Text under the logo' },
      defaultValue:
        'Spécialiste tunisien de l’espace professionnel. Conception, fourniture et réalisation sous un même toit depuis 2008.',
    },
    {
      name: 'socials',
      type: 'array',
      label: { fr: 'Réseaux sociaux', en: 'Social networks' },
      maxRows: 6,
      labels: {
        singular: { fr: 'Réseau', en: 'Network' },
        plural: { fr: 'Réseaux', en: 'Networks' },
      },
      admin: {
        description: {
          fr: 'L’icône dépend de la plateforme choisie. Faites-les glisser pour changer l’ordre.',
          en: 'The icon depends on the platform chosen. Drag them to reorder.',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              label: { fr: 'Plateforme', en: 'Platform' },
              admin: { width: '40%' },
              // A fixed list, not a free icon field: each option maps to an icon
              // drawn in the component, so the row can never render a blank.
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'X', value: 'x' },
                { label: 'LinkedIn', value: 'linkedin' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: { fr: 'Lien', en: 'Link' },
              admin: { width: '60%', placeholder: 'https://…' },
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'navTitle',
          type: 'text',
          label: { fr: 'Titre — colonne navigation', en: 'Heading — navigation column' },
          defaultValue: 'Navigation',
          admin: { width: '33%' },
        },
        {
          name: 'servicesTitle',
          type: 'text',
          label: { fr: 'Titre — colonne métiers', en: 'Heading — services column' },
          defaultValue: 'Nos métiers',
          admin: {
            width: '33%',
            description: {
              fr: 'Les liens de cette colonne viennent automatiquement de Métiers.',
              en: 'The links in this column come from Services automatically.',
            },
          },
        },
        {
          name: 'contactTitle',
          type: 'text',
          label: { fr: 'Titre — colonne contact', en: 'Heading — contact column' },
          defaultValue: 'Contact',
          admin: { width: '34%' },
        },
      ],
    },
    {
      name: 'navLinks',
      type: 'array',
      label: { fr: 'Liens de navigation', en: 'Navigation links' },
      maxRows: 10,
      labels: {
        singular: { fr: 'Lien', en: 'Link' },
        plural: { fr: 'Liens', en: 'Links' },
      },
      defaultValue: [
        { label: 'A propos', href: '/a-propos' },
        { label: 'Nos métiers', href: '/metiers' },
        { label: 'Nos projets', href: '/projets' },
        { label: 'Actualités', href: '#actualites' },
        { label: 'Contact', href: '#contact' },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: { fr: 'Texte', en: 'Text' },
              admin: { width: '50%' },
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              label: { fr: 'Lien', en: 'Link' },
              admin: { width: '50%', placeholder: '/projets' },
            },
          ],
        },
      ],
    },
    {
      name: 'legal',
      type: 'text',
      label: { fr: 'Mention en bas de page', en: 'Line at the very bottom' },
      defaultValue: 'Crafted by BigArt | 2026',
    },
  ],
}
