import { DefaultNavClient, NavHamburger, NavWrapper } from '@payloadcms/next/client'
import { getTranslation } from '@payloadcms/translations'
import { Logout } from '@payloadcms/ui'
import { EntityType, groupNavItems, type NavGroupType } from '@payloadcms/ui/shared'
import type {
  CollectionSlug,
  GlobalSlug,
  NavPreferences,
  PayloadRequest,
  ServerProps,
} from 'payload'
import { PREFERENCE_KEYS } from 'payload/shared'
import React from 'react'

import { SITE_PAGES } from '@/admin/pages'

type Props = ServerProps & { req?: PayloadRequest }

type Entity =
  | { type: 'collection'; slug: CollectionSlug }
  | { type: 'global'; slug: GlobalSlug }

const NO_PREFERENCES: NavPreferences = { groups: {}, open: true }

/**
 * Replaces Payload's sidebar with one group per page of the site, each listing
 * that page's sections — the layout lives in `src/admin/pages.ts`.
 *
 * Built from Payload's own nav pieces so it looks, collapses and remembers its
 * open groups exactly like the default. The settings menu is left out: none is
 * configured.
 */
export const PageNav: React.FC<Props> = async ({
  i18n,
  payload,
  permissions,
  req,
  visibleEntities,
}) => {
  const pageGroups = buildPageGroups(visibleEntities, permissions, i18n)
  const otherGroups = buildOtherGroups(payload, visibleEntities, permissions, i18n)
  const navPreferences = await getNavPreferences(req)

  return (
    <NavWrapper baseClass="nav">
      <nav className="nav__wrap">
        <DefaultNavClient groups={[...pageGroups, ...otherGroups]} navPreferences={navPreferences} />
        <div className="nav__controls">
          <Logout />
        </div>
      </nav>
      <div className="nav__header">
        <div className="nav__header-content">
          <NavHamburger baseClass="nav" />
        </div>
      </div>
    </NavWrapper>
  )
}

/**
 * `visibleEntities` is where `admin.hidden` — and so `hideUnless` — takes effect,
 * so an editor sees only the sections ticked on their profile.
 */
const canOpen = (
  entity: Entity,
  visibleEntities: Props['visibleEntities'],
  permissions: Props['permissions'],
): boolean =>
  entity.type === 'collection'
    ? Boolean(
        visibleEntities?.collections.includes(entity.slug) &&
          permissions?.collections?.[entity.slug]?.read,
      )
    : Boolean(
        visibleEntities?.globals.includes(entity.slug) && permissions?.globals?.[entity.slug]?.read,
      )

/** One group per page; a page with nothing this user may open is dropped. */
const buildPageGroups = (
  visibleEntities: Props['visibleEntities'],
  permissions: Props['permissions'],
  i18n: Props['i18n'],
): NavGroupType[] =>
  SITE_PAGES.flatMap((page) => {
    const entities = page.sections
      .filter((section) => canOpen(section, visibleEntities, permissions))
      .map((section) => ({
        label: section.label,
        slug: section.slug,
        type: section.type === 'collection' ? EntityType.collection : EntityType.global,
      }))

    return entities.length > 0 ? [{ label: getTranslation(page.label, i18n), entities }] : []
  })

/** Everything no page lists (Médias, Utilisateurs, Journal), under its own `admin.group`. */
const buildOtherGroups = (
  payload: Props['payload'],
  visibleEntities: Props['visibleEntities'],
  permissions: Props['permissions'],
  i18n: Props['i18n'],
): NavGroupType[] => {
  if (!permissions) return []

  const listed = new Set(
    SITE_PAGES.flatMap((page) => page.sections.map((section) => `${section.type}:${section.slug}`)),
  )
  const isOther = (entity: Entity) =>
    !listed.has(`${entity.type}:${entity.slug}`) && canOpen(entity, visibleEntities, permissions)

  const collections = payload.config.collections
    .filter((collection) =>
      isOther({ type: 'collection', slug: collection.slug as CollectionSlug }),
    )
    .map((entity) => ({ type: EntityType.collection as const, entity }))
  const globals = payload.config.globals
    .filter((global) => isOther({ type: 'global', slug: global.slug as GlobalSlug }))
    .map((entity) => ({ type: EntityType.global as const, entity }))

  return groupNavItems([...collections, ...globals], permissions, i18n)
}

/** Which groups the user left open or closed — the same preference the default nav reads. */
const getNavPreferences = async (req: Props['req']): Promise<NavPreferences> => {
  if (!req?.user?.collection) return NO_PREFERENCES

  const result = await req.payload.find({
    collection: 'payload-preferences',
    depth: 0,
    limit: 1,
    pagination: false,
    req,
    where: {
      and: [
        { key: { equals: PREFERENCE_KEYS.NAV } },
        { 'user.relationTo': { equals: req.user.collection } },
        { 'user.value': { equals: req.user.id } },
      ],
    },
  })

  return (result.docs[0]?.value as NavPreferences | undefined) ?? NO_PREFERENCES
}
