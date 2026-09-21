import type { Access, ClientUser, FieldAccess, TypedUser } from 'payload'

import type { SectionSlug } from './sections'

/**
 * Who may do what.
 *
 * Two roles. An **admin** can do everything, including managing users. An
 * **éditeur** can edit only the sections ticked on their profile, and can never
 * delete — deleting a document also deletes its version history, which is the
 * one action the panel cannot undo.
 *
 * `read` stays public everywhere. The public site reads through the Local API,
 * which skips access control entirely, so these rules only ever govern the admin
 * panel and the REST API.
 *
 * Roles are not written to the JWT: Payload reloads the user from the database
 * on every request, so a permission change takes effect immediately rather than
 * at the user's next login.
 */

/**
 * Structural rather than `User`: the same checks run against the full user on
 * the server and against Payload's trimmed `ClientUser` in `admin.hidden`, and
 * those two disagree on the type of `id`.
 */
type Actor = { role?: unknown; sections?: unknown } | null | undefined

export const isAdmin = (user: Actor): boolean => user?.role === 'admin'

/** Sections ticked on the user's profile, as plain strings. */
const sectionsOf = (user: Actor): string[] =>
  Array.isArray(user?.sections)
    ? user.sections.filter((section): section is string => typeof section === 'string')
    : []

export const canEditSection = (user: Actor, section: SectionSlug): boolean =>
  isAdmin(user) || sectionsOf(user).includes(section)

export const adminOnly: Access = ({ req: { user } }) => isAdmin(user)

export const loggedIn: Access = ({ req: { user } }) => Boolean(user)

/** Edit rights for one section — the rule behind create, update and readVersions. */
export const canEdit =
  (section: SectionSlug): Access =>
  ({ req: { user } }) =>
    canEditSection(user, section)

/**
 * Hides a section from the sidebar for users who cannot edit it.
 *
 * Cosmetic only — `admin.hidden` removes the nav entry and the routes, while the
 * access rules above are what actually stop the write.
 */
export const hideUnless =
  (section: SectionSlug) =>
  ({ user }: { user: ClientUser | TypedUser | null }): boolean =>
    // Both shapes are accepted because collections hand this callback Payload's
    // trimmed `ClientUser` while globals hand it the full user or null. The cast
    // covers `ClientUser`, whose type omits our fields though the values are there.
    !canEditSection(user as Actor, section)

/** Admins see every user; an editor sees only their own account. */
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user)) return true

  return { id: { equals: user.id } }
}

/** For the role and sections fields: an editor must never grant themselves rights. */
export const adminField: FieldAccess = ({ req: { user } }) => isAdmin(user)
