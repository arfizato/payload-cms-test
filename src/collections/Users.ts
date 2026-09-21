import type { CollectionConfig, PayloadRequest } from 'payload'
import { APIError } from 'payload'

import { GROUP } from '@/admin/i18n'
import { adminField, adminOnly, adminOrSelf, isAdmin } from '@/access'
import { SECTIONS } from '@/access/sections'
import { logUserChange, logUserDelete } from '@/hooks/logActivity'

/** Admins left besides this one document. */
const otherAdmins = async (id: number | string, req: PayloadRequest): Promise<number> => {
  const { totalDocs } = await req.payload.count({
    collection: 'users',
    req,
    where: { and: [{ role: { equals: 'admin' } }, { id: { not_equals: id } }] },
  })

  return totalDocs
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { fr: 'Utilisateur', en: 'User' },
    plural: { fr: 'Utilisateurs', en: 'Users' },
  },
  access: {
    // An editor sees and edits only their own account: name and password, never
    // their own role or sections — see the field access below.
    read: adminOrSelf,
    update: adminOrSelf,
    create: adminOnly,
    delete: adminOnly,
  },
  admin: {
    group: GROUP.admin,
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'updatedAt'],
  },
  auth: true,
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })

          // The very first account owns the site. Payload's create-first-user
          // screen runs with access control overridden, so nothing else here
          // could grant it — without this, a fresh install has no admin.
          if (totalDocs === 0) return { ...data, role: 'admin' }

          // Defence in depth: `create` is admin-only, so this only fires if that
          // rule is ever bypassed.
          if (!isAdmin(req.user)) return { ...data, role: 'editor', sections: [] }

          return data
        }

        // Demoting the last admin locks everyone out of user management, with no
        // way back through the panel.
        if (originalDoc?.role === 'admin' && data.role && data.role !== 'admin') {
          if ((await otherAdmins(originalDoc.id, req)) === 0) {
            throw new APIError(
              'Il doit rester au moins un administrateur. / At least one admin must remain.',
              400,
            )
          }
        }

        return data
      },
    ],
    afterChange: [logUserChange],
    beforeDelete: [
      async ({ id, req }) => {
        const doomed = await req.payload.findByID({ collection: 'users', id, req, depth: 0 })

        if (doomed?.role === 'admin' && (await otherAdmins(id, req)) === 0) {
          throw new APIError(
            'Il doit rester au moins un administrateur. / At least one admin must remain.',
            400,
          )
        }
      },
    ],
    afterDelete: [logUserDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { fr: 'Nom', en: 'Name' },
      // Not required: the accounts that exist today have none, and a required
      // column would fail on the migration.
      admin: {
        description: {
          fr: 'Affiché dans le panneau et dans le journal d’activité. À défaut, l’e-mail est utilisé.',
          en: 'Shown in the panel and in the activity log. Falls back to the email address.',
        },
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      label: { fr: 'Rôle', en: 'Role' },
      options: [
        { value: 'admin', label: { fr: 'Administrateur', en: 'Admin' } },
        { value: 'editor', label: { fr: 'Éditeur', en: 'Editor' } },
      ],
      access: { update: adminField },
      admin: {
        description: {
          fr: 'Un administrateur peut tout modifier, y compris les utilisateurs. Un éditeur ne voit que les sections cochées ci-dessous.',
          en: 'An admin can change everything, including users. An editor only sees the sections ticked below.',
        },
      },
    },
    {
      name: 'sections',
      type: 'select',
      hasMany: true,
      label: { fr: 'Sections autorisées', en: 'Allowed sections' },
      options: SECTIONS.map(({ value, label }) => ({ value, label })),
      access: { update: adminField },
      admin: {
        condition: (data) => data?.role !== 'admin',
        description: {
          fr: 'Les sections non cochées n’apparaissent pas dans le menu de cet utilisateur. Supprimer reste réservé aux administrateurs.',
          en: 'Sections left unticked do not appear in this user’s menu. Deleting stays admin-only.',
        },
      },
    },
  ],
}
