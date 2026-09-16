# Users, per-section permissions, activity log, document locking

**Status: decided, not built.** Plan agreed 2026-09-16. Tracked as backlog items 8 and 16.

Every Payload behaviour this plan relies on was checked against the installed 3.88 source;
the file is cited where it matters.

---

## Context

Today every logged-in user can do everything (the only access check is `Boolean(user)`),
users are just email + password, and nothing records **who** did what — Payload's version
rows store date, status and autosave flag but no author (`payload/dist/versions/buildCollectionFields.js`).
Versions are also capped (20/10/30), wiped when a document is deleted, and absent for Médias.
Document locking is off everywhere (`lockDocuments: false`), set for a single-editor site.

The client will now have several editors. Decided:

- **Roles:** Admin (everything) and Éditeur. An admin ticks, per user, which sections they may edit.
- Editors **publish** in their sections; **deleting is admin-only**.
- **Médias:** anyone logged in can upload; replacing/deleting an existing image is admin-only
  (it changes the image everywhere).
- **Activity log** (*Journal d'activité*): created / published / unpublished / deleted, image
  uploads & replacements, user and permission changes. **No** draft saves or autosaves.
  **Admins only** can read it.
- **Names** on users. **Document locking** turned back on.
- Shared rules live in **`src/access/`** (new convention → to be documented in
  `docs/content-architecture.md` when built).

The public site is unaffected: it reads through the Local API, which skips access control, and
every `read` rule stays public.

---

## 1. `src/access/` — the rules, written once

**`src/access/sections.ts`**
- `SECTIONS`: `{ value, label: { fr, en } }` for `projects`, `services`, `clients`, `stats`,
  `expertises`, `footer`, `site-info`. `value` **is** the collection/global slug, typed as
  `SectionSlug`, so a typo is a type error.

**`src/access/index.ts`**
- `isAdmin(user)`, `adminOnly: Access`, `loggedIn: Access`
- `canEdit(slug): Access` → admin, or editor whose `sections` includes `slug`
- `hideUnless(slug)` → for `admin.hidden({ user })`, hides the section from the sidebar
- `adminOrSelf: Access` → admin: `true`; editor: `{ id: { equals: user.id } }`
- `adminField: FieldAccess` → for `role` / `sections`

Sidebar visibility goes through `admin.hidden({ user })`, which exists on both collections and
globals. `access.admin` is **not** the tool for this — it decides who may log into the panel.

No `saveToJWT`: Payload 3 reloads `req.user` from the database per request, so a permission
change applies immediately instead of at next login.

## 2. Users — `src/collections/Users.ts`

Fields (all labels `{ fr, en }`, group `GROUP.admin` from `src/admin/i18n.ts`):
- `name` — text, optional (existing rows have none; `required` would break the migration).
- `role` — select `admin | editor`, required, default `editor`, `access.update: adminField`.
- `sections` — select `hasMany`, options from `SECTIONS`, `admin.condition` role = editor,
  `access.update: adminField`.

Access: `read`/`update: adminOrSelf`, `create`/`delete: adminOnly`. Editors therefore see
only themselves, can change their own name/password, and **cannot** change their role or sections.

Hooks (collection `beforeChange` runs *before* field access, so these are authoritative):
- **create:** if no users exist yet → `role = 'admin'`. Payload's create-first-user runs with
  `overrideAccess: true` (`auth/operations/registerFirstUser.js:40`), so admin-only `create`
  doesn't block it — and this hook is the only thing making that first account an admin.
  Otherwise, if the creator isn't admin → force `editor` with no sections.
- **update:** block demoting the **last** admin (`APIError`, 400, bilingual message).
- `beforeDelete`: block deleting the last admin.

## 3. Apply the rules to every section

Pattern, applied to `src/collections/{Projects,Services,Clients}.ts`:
```ts
access: { read: () => true, create: canEdit('projects'), update: canEdit('projects'),
          delete: adminOnly, readVersions: canEdit('projects') },
admin: { ..., hidden: hideUnless('projects') },
```
Globals `src/blocks/{Expertises,Stats,Footer}/config.ts`, `src/globals/SiteInfo.ts`:
`read: () => true`, `update` + `readVersions: canEdit(slug)`, `admin.hidden: hideUnless(slug)`.

`src/collections/Media.ts`: `read: () => true`, `create: loggedIn`, `update`/`delete: adminOnly`.
Consequence to tell the client: an editor can't fix the alt text of an existing image.

Permissions are per **admin section**, not per block on the site. Some sections feed several
pages — *Métiers* drives the homepage accordion, `/metiers` and the footer — so granting it
grants all three.

## 4. Activity log

**`src/collections/ActivityLog.ts`** — slug `activity-log`, *Journal d'activité / Activity log*,
group `GROUP.admin`. No versions, `lockDocuments: false`, `defaultSort: '-createdAt'`.
Fields: `user` (relationship → users), `userLabel` (text snapshot: name or email — survives the
user being deleted), `action` (select: created / published / unpublished / updated / deleted /
permissions), `section` (select: SECTIONS + media + users), `documentId`, `documentTitle` (snapshot).
Access: `read: adminOnly`; `create`/`update`/`delete: () => false` (immutable; hooks write via
the Local API, which bypasses access).

**`src/hooks/logActivity.ts`** — `logCollectionChange` (afterChange), `logCollectionDelete`
(afterDelete), `logGlobalChange` (afterChange).

Classification reads the **request flags the admin actually sends**, not `_status` alone.
`afterChange` receives no `draft` or `autosave` argument, and a draft save over a published
document reaches it with `previousDoc` published and `doc` draft — it *looks* like an unpublish,
but only a version was written (`collections/operations/utilities/update.js`). The admin sends
the flags as query params (`collections/endpoints/updateByID.js`, `globals/endpoints/update.js`,
`ui/.../UnpublishButton`):
- `req.searchParams`: `draft=true` or `autosave=true` → **skip**; `unpublishAllLocales=true`
  → `unpublished`; otherwise `doc._status === 'published'` → `published`.
- `operation === 'create'` → `created`; afterDelete → `deleted`.
- Médias (no drafts): create → `created`, update → `updated` (file replaced / edited).
- Users: create/delete logged; update logged as `permissions` **only** when `role` or
  `sections` changed (password/name edits skipped).
- **Skip when `!req.user`** — seeds, migrations, CLI.
- Write with `req.payload.create({ collection: 'activity-log', data, req })`. Passing `req`
  keeps the log line in the **same transaction** as the change: they commit or fail together,
  so the log never records something that didn't happen.

Registered on Projects, Services, Clients, Media, Users and the four globals, alongside the
existing `revalidateHome*` hooks. Added to `collections` in `src/payload.config.ts`.

## 5. Document locking

Remove `lockDocuments: false` (and its "single-editor" comment) from Projects, Services,
Clients and the four globals. Payload's default: a document open by someone shows
*"X is editing"* and offers a take-over.

Risk: it was disabled because its insert raced **autosave at 200 ms**; globals now autosave at
1 s and collections don't autosave. Checked in verification step 7. **Fallback if the race
reappears:** keep locking on for the three collections, off for the four globals, and say so
in the comment.

## 6. Migration

Adds `users.name`, `users.role`, `users_sections`, the `activity_log` table and its columns in
the locked-documents / preferences relations.

1. Run `pnpm payload migrate:create add_roles_and_activity_log`.
2. **Edit the generated file**: append `UPDATE "users" SET "role" = 'admin';` to `up()`.
   Without it every existing account becomes an editor with no sections — everyone locked out.
   It's in the committed migration, so production (Netlify runs `payload migrate`) gets it too.
3. Run `pnpm payload migrate`, then `pnpm payload generate:types`.

No custom admin component is added → no import-map step.

## 7. Docs to update when built

- `docs/content-architecture.md`: new short section *Access rules* — `src/access/`, `SECTIONS`
  = slugs, `read` stays public, new sections must be added to `SECTIONS` and use `canEdit`.
- `docs/admin-ui.md`: roles, what an editor sees, the activity log, locking.
- Change this file's status line to *built*.

---

## Verification

1. `pnpm build` passes; `tsc` clean after `generate:types`.
2. Logged in as the existing (now admin) account: every section, *Utilisateurs* and
   *Journal d'activité* visible.
3. Create **Éditeur A** with *Réalisations* + *Clients*, **Éditeur B** with *Chiffres clés*.
   Log in as A (private window): sidebar shows only Réalisations, Clients, Médias, Utilisateurs
   (self only); no delete button on projects; role/sections fields read-only on own profile;
   Account page loads.
4. Server-side: as A, `PATCH /api/globals/stats` and `DELETE /api/projects/:id` via the
   browser console → both **403**. Public `GET /api/globals/stats` still 200; homepage renders.
5. As A: publish a project, unpublish it, type in a draft for a while (autosave), upload an image.
   As admin: log shows exactly *Publié*, *Dépublié*, *Créé* (image) by A — **no** draft/autosave lines.
6. Admin changes B's sections → one *Droits modifiés* line. Try demoting/deleting the last admin → refused.
7. Locking: A and admin open the same project → second sees *"en cours d'édition"*. Then both
   open *Chiffres clés* and type for ~30 s with autosave; watch the server log for lock/insert
   errors. Errors → apply the fallback in §5.
8. Switch admin language to English: all new labels and the log's action names translate.

## Out of scope

- Per-document permissions (e.g. "A edits only project X").
- Retention/cleanup of old log lines (small site; revisit if it grows).
- Showing the author column inside Payload's own Versions list.
