import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access'
import { SECTIONS } from '@/access/sections'
import { GROUP } from '@/admin/i18n'

/**
 * Who did what, and when.
 *
 * Payload's versions record the content of every change but not its author —
 * version rows have no user column — and they are capped, and deleted along with
 * the document. This collection is the part that survives: it keeps the action
 * and the person, never the content.
 *
 * Written only by the hooks in `src/hooks/logActivity.ts`, which run through the
 * Local API and therefore bypass the access rules below. Nothing can write to it
 * through the panel or the REST API, and nothing can edit it afterwards — a log
 * that can be rewritten answers no question worth asking.
 */
export const ActivityLog: CollectionConfig = {
  slug: 'activity-log',
  labels: {
    singular: { fr: 'Activité', en: 'Activity' },
    plural: { fr: 'Journal d’activité', en: 'Activity log' },
  },
  access: {
    read: adminOnly,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  admin: {
    group: GROUP.admin,
    useAsTitle: 'documentTitle',
    defaultColumns: ['createdAt', 'userLabel', 'action', 'section', 'documentTitle'],
    description: {
      fr: 'Historique des publications, suppressions et changements de droits. Rempli automatiquement, en lecture seule.',
      en: 'History of publishes, deletions and permission changes. Filled in automatically, read-only.',
    },
  },
  defaultSort: '-createdAt',
  lockDocuments: false,
  fields: [
    {
      name: 'userLabel',
      type: 'text',
      label: { fr: 'Utilisateur', en: 'User' },
      // A copy of the name, not just the relationship below: the line has to stay
      // readable after the account is deleted, which is exactly when it matters.
      admin: { readOnly: true },
    },
    {
      name: 'action',
      type: 'select',
      label: { fr: 'Action', en: 'Action' },
      admin: { readOnly: true },
      options: [
        { value: 'created', label: { fr: 'Créé', en: 'Created' } },
        { value: 'published', label: { fr: 'Publié', en: 'Published' } },
        { value: 'unpublished', label: { fr: 'Dépublié', en: 'Unpublished' } },
        { value: 'updated', label: { fr: 'Modifié', en: 'Updated' } },
        { value: 'deleted', label: { fr: 'Supprimé', en: 'Deleted' } },
        { value: 'permissions', label: { fr: 'Droits modifiés', en: 'Permissions changed' } },
      ],
    },
    {
      name: 'section',
      type: 'select',
      label: { fr: 'Section', en: 'Section' },
      admin: { readOnly: true },
      options: [
        ...SECTIONS.map(({ value, label }) => ({ value, label })),
        { value: 'media', label: { fr: 'Médias', en: 'Media' } },
        { value: 'users', label: { fr: 'Utilisateurs', en: 'Users' } },
      ],
    },
    {
      name: 'documentTitle',
      type: 'text',
      label: { fr: 'Document', en: 'Document' },
      admin: { readOnly: true },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: { fr: 'Compte', en: 'Account' },
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'documentId',
      type: 'text',
      label: { fr: 'Identifiant', en: 'Document ID' },
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
}
