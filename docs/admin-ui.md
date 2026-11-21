# Customising the admin panel

The Payload admin is React, and nearly every part of it is replaceable. This matters more
than it sounds: the panel is the product the client actually touches. Everything else —
the schema, the rendering strategy, the hosting — is invisible to them.

Current state: `src/app/(payload)/custom.scss` is empty. The sidebar is replaced
(`admin.components.Nav` → `src/components/admin/PageNav.tsx`): one group per page of the
site, each listing that page's sections. The layout is the `SITE_PAGES` list in
`src/admin/pages.ts` — **adding a section or page to the site means adding it there**, or
it only shows up in the sidebar's leftover groups below the pages. Shared sections
(footer, clients, contact details) are listed under every page they appear on.

---

## What can be changed

**1. Branding — CSS variables.** `custom.scss` is already wired into the admin. Overriding
Payload's CSS custom properties recolours the whole panel. `admin.components.graphics.Logo`
and `.Icon` replace the Payload mark on the login screen and in the sidebar.

Cheap, and it changes how the client perceives the tool — it stops looking like developer
software and starts looking like theirs.

**2. Injected components.** Named slots that accept your own React:
`beforeDashboard`, `afterDashboard`, `beforeNavLinks`, `afterNavLinks`, `beforeLogin`.

**3. Field-level components.** Any field's input, list-view cell, label or description can
be swapped — colour swatches, character counters, map pickers, live value previews.

`admin.components.RowLabel` is the highest-value one here: array rows currently collapse to
"Expertise 01", "Expertise 02". A row label shows each row's own title instead, which is
the difference between scanning a list and counting rows.

**4. Whole custom views.** New admin routes with your own pages.

---

## Warning: the import map

Custom components must be registered in `src/app/(payload)/admin/importMap.js`.

**That file is generated and committed — it is not a build artefact.** After adding or
moving any custom component:

```bash
pnpm generate:importmap
```

then commit the updated `importMap.js`.

If you forget, the admin panel breaks **in production only**. Locally everything works,
because your generated file is correct; the deployed one is stale. You get a blank panel
and a module resolution error with no obvious link back to a file you forgot to commit
days earlier.

**Safety net:** add it to the deploy build command so it can never be stale.

```
pnpm payload generate:importmap && pnpm payload migrate && pnpm build
```

It costs seconds and needs `DATABASE_URL` at build time, which the migrate step already
requires.

---

## To implement: publish status indicator

**Required alongside the rendering split in `docs/rendering.md`.**

Once the public route is static, publishing no longer takes effect on the next request.
The page is regenerated on revalidation, so there is a short window — usually a second or
two — where the old version is still being served.

A non-technical editor will publish, immediately open the site, see the previous content,
and conclude the CMS is broken. They will not wait, and they will not know that a rebuild
is a thing that exists. This is the single most likely way to lose their trust in the
whole system, and it is caused entirely by an implementation detail they should never have
to know about.

So the panel has to say what is happening.

**Behaviour:**

1. Editor clicks Publish.
2. A status appears: *publishing — your changes will be live shortly*.
3. When the public page is actually serving the new version, it flips to *live*, with a
   link to view it.
4. If it does not resolve within a sensible window, it says so rather than spinning
   forever — an honest failure beats a hanging one.

**Mechanism.** Step 3 is the part that needs care: it must confirm the *public* page has
updated, not merely that the database write succeeded. Comparing the document's
`updatedAt` against a value exposed on the published page — a meta tag or a small
revalidated JSON endpoint — and polling until they match is the straightforward approach.
Do not use a fixed timer; on a cold host the guess will be wrong in both directions.

Lives as a custom admin component. Note the import map warning above.

---

## Quick wins worth doing first

- **Row labels** on the Expertises and Stats arrays — roughly 15 minutes for both.
- **Panel branding** — logo plus the `#A91E23` accent in `custom.scss`. Half an hour, and
  it is the most visible thing in a demo or a handover.
