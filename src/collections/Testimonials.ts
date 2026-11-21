import type { CollectionConfig } from 'payload'

import { adminOnly, canEdit, hideUnless } from '@/access'
import { GROUP, ORDER } from '@/admin/i18n'
import { logCollectionChange, logCollectionDelete } from '@/hooks/logActivity'
import { revalidateHomeCollection } from '@/hooks/revalidateHome'

/**
 * Client testimonials — the "Ils nous font confiance" carousel on the homepage.
 *
 * A collection because there are many and the client adds them as projects
 * finish. The section heading stays in code (`CHROME` in
 * src/blocks/Testimonials/adapt.ts), as for Nos réalisations.
 */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: { fr: 'Témoignage', en: 'Testimonial' },
    plural: { fr: 'Témoignages', en: 'Testimonials' },
  },
  access: {
    read: () => true,
    create: canEdit('testimonials'),
    update: canEdit('testimonials'),
    readVersions: canEdit('testimonials'),
    delete: adminOnly,
  },
  admin: {
    group: GROUP.content,
    hidden: hideUnless('testimonials'),
    useAsTitle: 'author',
    defaultColumns: ['author', 'role', 'order', 'updatedAt'],
    description: {
      fr: 'Visible sur : la page d’accueil, section « Ils nous font confiance », sous les réalisations. Trois témoignages sont visibles à la fois ; les flèches font défiler les suivants.',
      en: 'Visible on: the homepage, "Ils nous font confiance" section, under the projects. Three show at a time; the arrows scroll to the rest.',
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
          name: 'author',
          type: 'text',
          required: true,
          label: { fr: 'Nom affiché', en: 'Display name' },
          admin: {
            width: '50%',
            placeholder: 'Emna A.',
            description: {
              fr: 'Prénom et initiale du nom, comme le reste de la section.',
              en: 'First name and surname initial, like the rest of the section.',
            },
          },
        },
        {
          name: 'role',
          type: 'text',
          label: { fr: 'Fonction et entreprise', en: 'Role and company' },
          admin: { width: '50%', placeholder: 'COO chez Ooredoo' },
        },
      ],
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      maxLength: 220,
      label: { fr: 'Témoignage', en: 'Testimonial' },
      admin: {
        rows: 3,
        description: {
          fr: 'Sans guillemets. Les cartes ont toutes la même hauteur : au-delà de deux ou trois phrases, la carte s’allonge et décale ses voisines.',
          en: 'No quotation marks. The cards share one height, so past two or three sentences a card grows and pushes its neighbours.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'imageKind',
          type: 'select',
          required: true,
          defaultValue: 'logo',
          label: { fr: 'Type d’image', en: 'Image type' },
          options: [
            { value: 'logo', label: { fr: 'Logo du client', en: 'Client logo' } },
            { value: 'avatar', label: { fr: 'Photo (recadrée en rond)', en: 'Photo (cropped round)' } },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 1,
          max: 5,
          defaultValue: 5,
          label: { fr: 'Note sur 5', en: 'Rating out of 5' },
          admin: { width: '50%', step: 1 },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: { fr: 'Image', en: 'Image' },
      admin: {
        description: {
          fr: 'Facultatif. Un logo est affiché entier, sur 48 px de haut : PNG transparent recadré au plus près. Une photo est recadrée en rond : visage centré.',
          en: 'Optional. A logo shows whole, 48px tall: a transparent PNG trimmed tight. A photo is cropped round: centre the face.',
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
