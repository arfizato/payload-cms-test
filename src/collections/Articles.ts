import { slugField, ValidationError, type CollectionConfig } from 'payload'

import { adminOnly, canEdit, canEditSection, hideUnless } from '@/access'
import { GROUP } from '@/admin/i18n'
import { logCollectionChange, logCollectionDelete } from '@/hooks/logActivity'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Article', plural: 'Articles' },
  access: {
    read: ({ req: { user } }) =>
      canEditSection(user, 'articles') || { _status: { equals: 'published' } },
    create: canEdit('articles'),
    update: canEdit('articles'),
    readVersions: canEdit('articles'),
    delete: adminOnly,
  },
  admin: {
    group: GROUP.content,
    hidden: hideUnless('articles'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, req }) => {
        const sections = data.sections === undefined ? originalDoc?.sections : data.sections
        const legacyBody = data.body === undefined ? originalDoc?.body : data.body
        const status = data._status ?? originalDoc?._status
        if (status === 'published' && !sections?.length && !legacyBody?.root?.children?.length) {
          throw new ValidationError({
            collection: 'articles',
            errors: [
              {
                path: 'sections',
                message:
                  req.i18n.language === 'fr'
                    ? 'Ajoutez au moins une section avant de publier.'
                    : 'Add at least one section before publishing.',
              },
            ],
            req,
          })
        }
        return data
      },
    ],
    afterChange: [logCollectionChange],
    afterDelete: [logCollectionDelete],
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', type: 'text', required: true, label: { fr: 'Titre', en: 'Title' } },
    slugField({ useAsSlug: 'title' }),
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      label: { fr: 'Résumé', en: 'Summary' },
      admin: {
        description: {
          fr: 'Ce texte s’affiche sur la carte et dans l’introduction de l’article.',
          en: 'Shown on the listing card and in the article introduction.',
        },
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: { fr: 'Image de couverture', en: 'Cover image' },
    },
    {
      name: 'detailImage',
      type: 'upload',
      relationTo: 'media',
      label: { fr: 'Image principale de l’article', en: 'Article hero image' },
      admin: {
        description: {
          fr: 'Facultative. L’image de couverture est utilisée par défaut.',
          en: 'Optional. Defaults to the cover image.',
        },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'article-categories',
      required: true,
      label: { fr: 'Catégorie', en: 'Category' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      index: true,
      defaultValue: () => new Date().toISOString(),
      label: { fr: 'Date de publication', en: 'Publication date' },
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'sections',
      type: 'array',
      labels: {
        singular: { fr: 'Section', en: 'Section' },
        plural: { fr: 'Sections', en: 'Sections' },
      },
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true, label: { fr: 'Titre', en: 'Heading' } },
        { name: 'body', type: 'richText', required: true, label: { fr: 'Texte', en: 'Body' } },
        {
          name: 'images',
          type: 'array',
          maxRows: 2,
          labels: { singular: 'Image', plural: 'Images' },
          admin: {
            description: {
              fr: 'Une image s’affiche en pleine largeur. Deux images s’affichent côte à côte sur ordinateur.',
              en: 'One image displays full width. Two images sit side by side on desktop.',
            },
          },
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Image' },
            { name: 'caption', type: 'text', label: { fr: 'Légende', en: 'Caption' } },
          ],
        },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      label: { fr: 'Contenu précédent', en: 'Previous content' },
      admin: {
        condition: (data) => Boolean(data?.body),
        description: {
          fr: 'Pour les articles existants. Ce contenu s’affiche tant qu’aucune section n’est ajoutée.',
          en: 'For existing articles. This content is displayed until sections are added.',
        },
      },
    },
  ],
}
