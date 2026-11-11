import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

/** Routes whose output depends on CMS content. */
const PATHS = ['/', '/projets', '/metiers', '/contact', '/a-propos', '/next/content-version']

const revalidate = (reason: string): void => {
  try {
    PATHS.forEach((path) => revalidatePath(path))
  } catch (err) {
    // revalidatePath throws outside a request context — migrations, seeding, the
    // CLI. A failed revalidation must never fail the write that triggered it.
    console.warn(`[revalidate] skipped for ${reason}:`, (err as Error).message)
  }
}

/**
 * Rebuilds the static homepage when published content changes.
 *
 * Both globals run `autosave: { interval: 200 }`, so this fires every fifth of a
 * second while an editor types. Without the published-status guard below it would
 * rebuild the static page continuously and defeat the whole point of it being
 * static — hence the early returns rather than a blanket revalidate.
 */
export const revalidateHomeGlobal: GlobalAfterChangeHook = ({ doc, previousDoc }) => {
  const status = (doc as { _status?: string })?._status
  const previousStatus = (previousDoc as { _status?: string })?._status

  // Autosaved drafts change nothing a visitor can see.
  if (status !== 'published') return doc

  // Publishing without edits (or a no-op save on an already-published doc) leaves
  // updatedAt untouched; nothing to rebuild.
  const updatedAt = (doc as { updatedAt?: string })?.updatedAt
  const previousUpdatedAt = (previousDoc as { updatedAt?: string })?.updatedAt
  if (previousStatus === 'published' && updatedAt && updatedAt === previousUpdatedAt) return doc

  revalidate(`global change (${status})`)

  return doc
}

/**
 * Media has no draft/publish cycle, so any change to a file is immediately visible
 * to visitors and always warrants a rebuild.
 */
export const revalidateHomeCollection: CollectionAfterChangeHook = ({ doc }) => {
  revalidate('media change')

  return doc
}
