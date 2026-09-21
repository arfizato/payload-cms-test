import type { CollectionConfig } from 'payload'

import { adminOnly, canEdit, hideUnless } from '@/access'
import { GROUP, ORDER } from '@/admin/i18n'
import { logCollectionChange, logCollectionDelete } from '@/hooks/logActivity'
import { revalidateHomeCollection } from '@/hooks/revalidateHome'

/**
 * The company's services — what the homepage calls "Nos métiers".
 *
 * A collection rather than rows inside the Expertises global, because projects
 * tag themselves with these. Kept as an array they would be duplicated as free
 * text on every project and drift the moment someone typed "Signalitique".
 *
 * The Expertises global still owns the section's chrome (label, heading); this
 * owns the entries.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: { fr: 'Métier', en: 'Service' },
    plural: { fr: 'Métiers', en: 'Services' },
  },
  access: {
    read: () => true,
    create: canEdit('services'),
    update: canEdit('services'),
    readVersions: canEdit('services'),
    delete: adminOnly,
  },
  admin: {
    group: GROUP.content,
    hidden: hideUnless('services'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'updatedAt'],
    description: {
      fr: 'Visible sur : la page d’accueil (section Nos métiers), la page Nos métiers, et le menu du pied de page de toutes les pages. Sert aussi à étiqueter les réalisations.',
      en: 'Visible on: the homepage (Nos métiers section), the Nos métiers page, and the footer menu on every page. Also used to tag projects.',
    },
  },
  hooks: {
    afterChange: [revalidateHomeCollection, logCollectionChange],
    afterDelete: [logCollectionDelete],
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: { fr: 'Titre', en: 'Title' },
      admin: { placeholder: 'Cloisonnement' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: { fr: 'Texte', en: 'Text' },
      admin: {
        description: {
          fr: 'Affiché quand la ligne de l’accordéon est ouverte. Facultatif.',
          en: 'Shown when the accordion row is open. Optional.',
        },
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { fr: 'Photo principale', en: 'Main photo' },
      admin: {
        description: {
          fr: 'Affichée dans l’accordéon de la page d’accueil.',
          en: 'Shown in the accordion on the homepage.',
        },
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: { fr: 'Légende de la photo principale', en: 'Main photo caption' },
      admin: {
        description: {
          fr: 'Affichée sur la photo, en bas à gauche. Facultatif.',
          en: 'Shown on the photo, bottom left. Optional.',
        },
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: { fr: 'Galerie', en: 'Gallery' },
      labels: { singular: 'Photo', plural: 'Photos' },
      admin: {
        description: {
          fr: 'Carrousel de la page Nos métiers. Ajoutez autant de photos que vous voulez et faites-les glisser pour changer l’ordre. Si la galerie est vide, le carrousel affiche la photo principale : rien ne casse, il ne défile simplement pas.',
          en: 'Carousel on the Nos métiers page. Add as many photos as you like and drag them to reorder. If the gallery is empty, the carousel shows the main photo: nothing breaks, it just won’t scroll.',
        },
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Photo',
        },
        {
          name: 'caption',
          type: 'text',
          label: { fr: 'Légende', en: 'Caption' },
          admin: {
            description: {
              fr: 'Affichée dans la barre en bas de cette photo. Facultatif.',
              en: 'Shown in the bar across the bottom of this photo. Optional.',
            },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'linkLabel',
          type: 'text',
          label: { fr: 'Texte du lien', en: 'Link text' },
          defaultValue: 'Découvrir',
          admin: { width: '50%' },
        },
        {
          name: 'linkHref',
          type: 'text',
          label: { fr: 'Adresse du lien', en: 'Link URL' },
          defaultValue: '#',
          admin: { width: '50%' },
        },
      ],
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
