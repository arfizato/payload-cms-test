import type { CollectionConfig } from 'payload'

import { adminOnly, canEdit, hideUnless } from '@/access'
import { GROUP } from '@/admin/i18n'
import { logCollectionChange, logCollectionDelete } from '@/hooks/logActivity'

export const ArticleCategories: CollectionConfig = {
  slug: 'article-categories',
  labels: {
    singular: { fr: 'Catégorie d’article', en: 'Article category' },
    plural: { fr: 'Catégories d’articles', en: 'Article categories' },
  },
  access: {
    read: () => true,
    create: canEdit('article-categories'),
    update: canEdit('article-categories'),
    delete: adminOnly,
  },
  admin: {
    group: GROUP.content,
    hidden: hideUnless('article-categories'),
    useAsTitle: 'title',
  },
  hooks: { afterChange: [logCollectionChange], afterDelete: [logCollectionDelete] },
  fields: [
    { name: 'title', type: 'text', label: { fr: 'Nom', en: 'Name' }, required: true, unique: true },
  ],
}
