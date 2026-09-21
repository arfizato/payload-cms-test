import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
  SanitizedCollectionConfig,
  TypedUser,
} from 'payload'

import type { ActivityLog } from '@/payload-types'

/**
 * Writes one line to the Journal d'activité per action worth recording.
 *
 * **Why the request flags rather than `_status`.** `afterChange` is given no
 * `draft` or `autosave` argument, and saving a draft on a published document
 * arrives here looking exactly like an unpublish: `previousDoc` is published,
 * `doc` is a draft. Only a version was written; nothing a visitor sees changed.
 * The admin panel sends the truth in the query string — `draft`, `autosave`,
 * `unpublishAllLocales` — so that is what this reads.
 *
 * **Why `req` is passed to the write.** It keeps the log line inside the same
 * database transaction as the change itself, so the two commit or fail together.
 * Logging in its own transaction would eventually record a publish that rolled
 * back.
 *
 * Actions by nobody — seeds, migrations, the CLI — are skipped: they have no
 * author, and inventing one would make the log lie.
 */

type Action = NonNullable<ActivityLog['action']>

/** Every slug the log can attribute a line to — the sections, plus media and users. */
type LogSection = NonNullable<ActivityLog['section']>

const flag = (req: PayloadRequest, name: string): boolean =>
  req.searchParams?.get(name) === 'true'

const labelFor = (user: Partial<TypedUser>): string =>
  (typeof user.name === 'string' && user.name) || user.email || String(user.id)

/** The document's title as the panel shows it, snapshotted into the line. */
const titleOf = (doc: Record<string, unknown>, collection: SanitizedCollectionConfig): string => {
  const key = collection.admin?.useAsTitle
  const value = key ? doc?.[key] : undefined

  if (typeof value === 'string' && value) return value
  if (typeof doc?.filename === 'string') return doc.filename

  return String(doc?.id ?? '')
}

const write = async ({
  action,
  documentId,
  documentTitle,
  req,
  section,
}: {
  action: Action
  documentId: string
  documentTitle: string
  req: PayloadRequest
  section: LogSection
}): Promise<void> => {
  const user = req.user
  if (!user) return

  await req.payload.create({
    collection: 'activity-log',
    req,
    data: {
      action,
      documentId,
      documentTitle,
      section,
      user: user.id,
      userLabel: labelFor(user),
    },
  })
}

/**
 * Publishes, unpublishes and creations on a drafted collection; plain saves on
 * one without drafts (Médias). Draft saves and autosaves return null — they are
 * work in progress, and autosave alone would write a line per second.
 */
const classify = (
  req: PayloadRequest,
  doc: Record<string, unknown>,
  operation: 'create' | 'update',
  hasDrafts: boolean,
): Action | null => {
  if (operation === 'create') return 'created'
  if (!hasDrafts) return 'updated'
  if (flag(req, 'draft') || flag(req, 'autosave')) return null
  if (flag(req, 'unpublishAllLocales')) return 'unpublished'

  return doc?._status === 'published' ? 'published' : null
}

export const logCollectionChange: CollectionAfterChangeHook = async ({
  collection,
  doc,
  operation,
  req,
}) => {
  const action = classify(req, doc, operation, Boolean(collection.versions?.drafts))

  if (action) {
    await write({
      action,
      documentId: String(doc?.id ?? ''),
      documentTitle: titleOf(doc, collection),
      req,
      section: String(collection.slug) as LogSection,
    })
  }

  return doc
}

export const logCollectionDelete: CollectionAfterDeleteHook = async ({ collection, doc, req }) => {
  await write({
    action: 'deleted',
    documentId: String(doc?.id ?? ''),
    documentTitle: titleOf(doc, collection),
    req,
    section: String(collection.slug) as LogSection,
  })

  return doc
}

export const logGlobalChange: GlobalAfterChangeHook = async ({ doc, global, req }) => {
  if (flag(req, 'draft') || flag(req, 'autosave')) return doc

  const action: Action = flag(req, 'unpublishAllLocales')
    ? 'unpublished'
    : doc?._status === 'published'
      ? 'published'
      : 'updated'

  // A global that is neither published nor unpublished here is an autosave that
  // slipped through without the flag; nothing visitor-facing happened.
  if (action === 'updated') return doc

  const label = typeof global.label === 'object' ? global.label.fr : global.label

  await write({
    action,
    documentId: global.slug,
    documentTitle: String(label ?? global.slug),
    req,
    section: String(global.slug) as LogSection,
  })

  return doc
}

/**
 * Users get their own pair: a password or name change is nobody's business, but
 * a role or section change is the most sensitive edit in the panel.
 */
export const logUserChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  previousDoc,
  req,
}) => {
  const rights = (user: Record<string, unknown>): string =>
    JSON.stringify([user?.role, [...((user?.sections as string[]) ?? [])].sort()])

  const action: Action | null =
    operation === 'create' ? 'created' : rights(doc) === rights(previousDoc) ? null : 'permissions'

  if (action) {
    await write({
      action,
      documentId: String(doc?.id ?? ''),
      documentTitle: labelFor(doc as Partial<TypedUser>),
      req,
      section: 'users',
    })
  }

  return doc
}

export const logUserDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await write({
    action: 'deleted',
    documentId: String(doc?.id ?? ''),
    documentTitle: labelFor(doc as Partial<TypedUser>),
    req,
    section: 'users',
  })

  return doc
}
