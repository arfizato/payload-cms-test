# Backlog

Working list. Tick items off as they land; delete this file when it empties.

Ordering below is by risk, not by how interesting the work is.

---

## Risk and correctness

- [x] **1. Rendering split (fix A)** — done.
      `/` is `force-static`, `/preview` is dynamic, both render the shared
      `_home/HomeView` so the markup cannot drift. `revalidateHome` hooks on both globals
      and Media, guarded so autosave does not trigger rebuilds. `/next/content-version`
      reports what the static site is serving, and `PublishStatus` compares it against the
      database to tell the editor when a publish is actually live.

- [x] **2 + 3. Migrations replace dev push** — done.
      `push: false` on both adapters. The stale migration (which predated the Expertises
      and Stats globals) was deleted and regenerated against the current config, so it now
      creates all 21 tables. The database's `dev` / batch `-1` marker was replaced with
      that migration recorded as applied — the tables already existed, so it must be
      recorded rather than executed.

      **What this was actually costing:** every Netlify deploy ran `payload migrate`, hit
      *"It looks like you've run Payload in dev mode… proceed? (y/N)"*, and sat there for
      **5m17s** before defaulting to no. Migrations had never once run in production, and
      no deploy ever failed, so nothing surfaced it. Deploys should now be ~1 minute.

      **Workflow from here:** change a config → `pnpm payload migrate:create <name>` →
      commit the file. Never push.

- [x] **4. R2 credentials in Netlify** — done and verified. Uploads reach the bucket from
      the deployed site.

- [ ] **5. `schedulePublish`**
      Enabled on the Expertises and Stats globals with no `jobs` block in the config, so
      the option appears in the admin and silently does nothing.
      Either wire the jobs queue (an external scheduler on serverless, an `autoRun` flag on
      a long-running host) or remove it. A button that lies is worse than no button.

---

## Content model

- [x] **6. Projets carousel** — done.
      `Projects` collection with auto-generated slug, `sector`/`city`, `summary`, image,
      a `relationship` to services for the tags, plus `featured` and `order`. Expertises
      were promoted to a `services` collection first so the tags could reference them —
      rename a service and every project's tag follows.
      The carousel slides one card at a time rather than paging two, so an odd number of
      projects never leaves a half-empty page, and autoplays with a hover pause.
      Detail pages deliberately not built: slugs exist so they can be added without
      backfilling published documents.

- [x] **7. Client logo band** — done.
      `Clients` collection — `name`, `logo`, optional `website`, `order` — read by both the
      homepage and `/projets`. Adding a client is an upload in the admin, no deploy.
      The five existing logos were re-uploaded through Payload by the seed route, so they
      are Media documents now rather than files sitting in the bucket by hand.

      Two details worth keeping:
      - A `website` makes the logo a link, but the marquee repeats each logo three times to
        fill the row, so **only the first copy is focusable** — otherwise tabbing walks the
        same five brands fifteen times.
      - The field description carries the design constraint: the row scales every logo to
        one height, so padding baked into the file makes a logo look smaller than its
        neighbours. An editor has no way to know that unless the field says so.

      **Decided: Navbar and Hero stay hardcoded.** That copy changes once a year, and the
      hero's layout depends on the headline breaking exactly where it does. Not worth the
      fields. Same for the `/projets` hero.

- [ ] **8. Payload roles and per-section permissions** — planned, not built.
      **Plan: [`docs/users-and-permissions.md`](users-and-permissions.md).**
      Everything currently gates on "is anyone logged in", so any account can edit users
      and settings. This is the piece that makes a handoff to a non-technical client safe.

      Decided: Admin and Éditeur roles; an admin ticks, per editor, which sections they may
      edit. Editors publish in their sections, deleting is admin-only, and replacing an
      existing image is admin-only. Also in scope: names on users and turning document
      locking back on.

- [ ] **16. Audit trail — who published what** — planned, not built.
      **Plan: [`docs/users-and-permissions.md`](users-and-permissions.md) §4.**

      **Decided: the `audit-log` option below**, as a *Journal d'activité* collection readable
      by admins only. It records created / published / unpublished / deleted, image uploads
      and replacements, and user permission changes — **not** draft saves or autosaves. The
      author-fields option is superseded: it loses the trail on delete, which is exactly the
      case a log exists for.

      Verified against the schema: version tables (`_projects_v` and friends) store a full
      snapshot, `_status` and timestamps, but **no user column**. So there is complete
      history and no authorship — with two editors you cannot tell which of them published
      something. Payload's open-source build has no audit log; that is an Enterprise feature.

      Two options, and they solve different problems:

      - **Author fields on the collections.** A `relationship` to users set by a
        `beforeChange` hook from `req.user`. Because versions snapshot the whole document,
        the author is captured in every version automatically and shows up in the Versions
        tab. ~20 lines, reusable, needs a migration.
        Blind spot: delete the document and the trail goes with it.
      - **An `audit-log` collection.** `afterChange` / `afterDelete` hooks writing
        `{ collection, docId, user, operation, status, timestamp }`. Heavier, but it records
        deletions and survives the document being removed.

      Gotcha for either: a hook writing through `req.payload` must pass `req` along, or the
      write runs in its own transaction and can commit while the operation it is logging
      rolls back.

      Pairs with item 8 — roles decide who *can* act, the audit records who *did*. Together
      they are the governance answer for the client handoff.

- [ ] **17. Actualités → a collection (blocked: needs editorial input)**
      Three hardcoded articles in `src/blocks/News/placeholder.ts`. Deliberately not built
      yet — the content model depends on how the client actually intends to use the blog,
      and guessing wrong here is expensive to undo once posts are published.

      **The blocking question — categories.** The card shows `Signalétique. Juil 2025.`,
      and *Signalétique* is a métier. Three ways to model it:
      - **Relationship to `services`** — consistent with project tags, no drift, enables
        "all Signalétique articles". But every article would have to be about a métier;
        there is no room for *Événement* or *Vie de l'entreprise* without inventing fake
        métiers.
      - **Its own `categories` collection** — editors add categories freely without
        polluting Métiers. Costs a collection, and "Signalétique" then exists in two places.
      - **Free text** — drifts immediately, no filtering. Rejected for project tags for
        exactly this reason.

      **Also unresolved:**
      - Do articles get detail pages at `/actualites/[slug]`? Both "LIRE" and "Voir toutes
        les actualités" imply yes, and that decides whether a `body` rich-text field is
        needed and which Lexical features it should allow.
      - Is there a byline? Nothing in the design suggests one, but clients usually ask.
      - Date precision: the design shows `Juil 2025`. Store a real `date` field and format
        it in the adapter — not a text field — or sorting and filtering never work.
      - Homepage selection: latest three, or a `featured` flag as Projects uses? Latest-N
        means an accidental publish rearranges the homepage.
      - Is there an `/actualites` index page as well as the homepage strip?

      **Already settled by precedent, when it is built:**
      - Slug generated on save, so detail pages can arrive later without backfilling
        published documents (same as Projects).
      - Add the new routes to `PATHS` in `src/hooks/revalidateHome.ts`. Forgetting this is
        the failure that looks like caching and has no error attached to it.
      - Section chrome (badge, heading, CTA) stays hardcoded, as it is for Projects.

- [ ] **18. Question — should section headings be editable at all?**
      Not a task yet. An open question about consistency, raised because the answer is
      currently *"it depends which section"*, which is the worst of the options.

      Today:

      | Section | Heading editable? |
      |---|---|
      | Nos métiers | yes — `badge` and `headingLines` on the Expertises global |
      | Pied de page | yes — the three column titles |
      | Nos réalisations | no — `CHROME` in `src/blocks/Projects/adapt.ts` |
      | Actualités | no — `src/blocks/News/placeholder.ts` |
      | Contact | no — headings, form labels, chips, submit text |

      Nothing signals to an editor which is which. They will change one heading, try the
      next, and find no field — a panel that behaves unpredictably is worse than one that
      is consistently limited.

      **The question is which way to make it consistent**, and it is genuinely open:

      - **Make them all editable.** A `badge` / `headingLines` / `cta` group per section,
        the shape Expertises already uses. The panel becomes predictable and demos as
        "the page is editable". Costs a handful of fields per section that will be edited
        approximately never, and every one is a chance to break a deliberate line break —
        the headings are set to wrap at a specific point.
      - **Make them all hardcoded**, including removing the Expertises fields. Honest, and
        matches the Navbar/Hero decision: this is typography, not content. But it takes
        something away that already works.

      Worth deciding before the client handoff rather than after, because whichever way it
      goes, the answer should be the same everywhere. Related: the Navbar and Hero decision
      under item 7.

- [ ] **19. Let the client create project categories**
      The `/projets` filter row runs off a `category` **select** on the Projects collection,
      with the four options from the design fixed in `src/blocks/Projects/categories.ts`.
      Adding a fifth — Télécoms and BPO already exist as `sector` values with no matching
      category — needs a developer, an edit, and a deploy. That is the one thing this
      project is trying to get away from.

      The fix is the pattern already used for Métiers: a **Secteurs collection**, with
      `category` becoming a `relationship` to it. Editors add and reorder categories
      themselves and the labels cannot drift, exactly as `Projects.services` → `Services`
      works today.

      Deferred deliberately, not overlooked — the select ships the design now, and the
      migration to a relationship is mechanical once the client has told us what the real
      category list is. Do it *before* they have tagged fifty projects, not after.

      Note the two fields are not the same axis and should stay separate: `sector` is the
      free-text line printed on the card ("Multinationale. Tunis."), `category` is the
      filter bucket ("Multinationales").

---

## SEO and polish

- [x] **9. Upload sizing and format** — done, though not with `imageSizes`.
      `resizeOptions` (2400px cap) + `formatOptions` (WebP q80) on the Media collection, so
      every upload is converted and capped on the way in. Verified end to end: a 4000x3000
      PNG stores as a 2400x1800 WebP.
      `imageSizes` was skipped deliberately — it generates named variants, but the
      components pass `media.url` and let `next/image` size things, so the variants would
      sit unused. Revisit only if art-directed crops are ever needed.
      Existing files were converted too: media 2691KB -> 550KB, static assets 378KB -> 260KB.

- [ ] **10. `generateMetadata` and the SEO plugin** — before detail pages exist.

- [ ] **11. Sitemap and robots.txt**, generated from Payload, filtered on published status.

- [ ] **12. Admin quick wins** — `RowLabel` on the Expertises and Stats arrays, panel
      branding in `custom.scss`. See `docs/admin-ui.md`.

- [ ] **13. Logo as SVG** — the current `logo.png` is 122px wide and soft on retina.
      Needs the vector export from whoever owns the Figma file.

- [x] **14. Live preview subscription** — done.
      `useGlobalPreview` subscribes to Payload's postMessage channel, filters on
      `globalSlug`, and runs incoming data through `mergeData` before the adapters.
      Not `useLivePreview` from the react package: it caches the merged document in a
      module-level singleton, so two globals on one page overwrite each other.
      Editing a **service or project** still reloads rather than streaming — collections
      only broadcast the document currently open in the admin.

- [ ] **15. Postgres pool settings**
      A homepage request died with `read ECONNRESET` on `select count(*) from "services"`.
      Neon's pooler closes idle connections and `pg` handed out a dead socket; requests
      either side succeeded, so it is transient rather than a code fault.
      Set `idleTimeoutMillis` below Neon's cutoff and a sane `max` on the adapter. Worth
      doing before any demo — an intermittent 500 on the homepage is the worst possible
      moment for it.
