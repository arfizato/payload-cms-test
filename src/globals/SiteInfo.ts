import type { GlobalConfig } from 'payload'

import { canEdit, hideUnless } from '@/access'
import { GROUP } from '@/admin/i18n'
import { logGlobalChange } from '@/hooks/logActivity'
import { revalidateHomeGlobal } from '@/hooks/revalidateHome'

/**
 * The company's practical details — address, phone, email, opening hours.
 *
 * Lives in `src/globals/` rather than beside a block because it belongs to no
 * single section: the contact section renders these with labels and icons, the
 * footer renders the values alone, and the map geocodes the address. Before this
 * existed the same address was written in three places and had already drifted
 * ("Ariana Tunisie" in one, "Ariana" in another).
 */
export const SiteInfoGlobal: GlobalConfig = {
  slug: 'site-info',
  label: { fr: 'Coordonnées', en: 'Contact details' },
  access: {
    read: () => true,
    update: canEdit('site-info'),
    readVersions: canEdit('site-info'),
  },
  admin: {
    group: GROUP.site,
    hidden: hideUnless('site-info'),
    description: {
      fr: 'Visible sur : le pied de page de toutes les pages, et la section Contact de la page d’accueil (adresse, téléphone, e-mail et la carte).',
      en: 'Visible on: the footer of every page, and the Contact section of the homepage (address, phone, email and the map).',
    },
    components: {
      elements: {
        beforeDocumentControls: [
          {
            path: '@/components/admin/PublishStatus#PublishStatus',
            clientProps: { globalSlug: 'site-info' },
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
      name: 'details',
      type: 'array',
      label: { fr: 'Coordonnées', en: 'Contact details' },
      minRows: 1,
      maxRows: 8,
      labels: {
        singular: { fr: 'Coordonnée', en: 'Detail' },
        plural: { fr: 'Coordonnées', en: 'Details' },
      },
      admin: {
        description: {
          fr: 'Affichées avec un titre et une icône dans la section Contact, et en simples lignes dans le pied de page. Faites-les glisser pour changer l’ordre.',
          en: 'Shown with a heading and icon in the Contact section, and as plain lines in the footer. Drag them to reorder.',
        },
      },
      defaultValue: [
        { label: 'Adresse', value: 'Rue Fatma Ezzahra, Ariana Tunisie', icon: 'location' },
        { label: 'Téléphone', value: '+216 31 536 548', icon: 'phone' },
        { label: 'Email', value: 'contact@groupebigart.tn', icon: 'mail' },
        { label: 'Horaires', value: 'Lun. Ven. 8h00 à 17h30', icon: 'clock' },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: { fr: 'Intitulé', en: 'Label' },
              admin: { width: '30%' },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              label: { fr: 'Valeur', en: 'Value' },
              admin: { width: '45%' },
            },
            {
              name: 'icon',
              type: 'select',
              required: true,
              defaultValue: 'location',
              label: { fr: 'Icône', en: 'Icon' },
              admin: { width: '25%' },
              // Fixed list: each maps to an icon drawn in the component, so a row
              // can never render without one.
              options: [
                { label: { fr: 'Adresse', en: 'Address' }, value: 'location' },
                { label: { fr: 'Téléphone', en: 'Phone' }, value: 'phone' },
                { label: 'Email', value: 'mail' },
                { label: { fr: 'Horaires', en: 'Opening hours' }, value: 'clock' },
              ],
            },
          ],
        },
        {
          name: 'inFooter',
          type: 'checkbox',
          defaultValue: true,
          label: { fr: 'Afficher dans le pied de page', en: 'Show in the footer' },
          admin: {
            description: {
              fr: 'Les horaires sont en général laissés hors du pied de page.',
              en: 'Opening hours are usually left out of the footer.',
            },
          },
        },
      ],
    },
    {
      name: 'mapQuery',
      type: 'text',
      label: { fr: 'Adresse pour la carte', en: 'Address for the map' },
      admin: {
        description: {
          fr: 'L’adresse utilisée pour placer le repère sur la carte. Laissez vide pour utiliser la première adresse ci-dessus.',
          en: 'The address used to place the pin on the map. Leave empty to use the first address above.',
        },
        placeholder: 'Rue Fatma Ezzahra, Ariana, Tunisie',
      },
    },
  ],
}
