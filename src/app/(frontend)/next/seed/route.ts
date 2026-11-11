import { getPayload } from 'payload'

import config from '@/payload.config'
import { clientLogosPlaceholder } from '@/blocks/ClientLogos'
import { certificationsPlaceholder } from '@/blocks/Certifications'
import { expertisesPlaceholder } from '@/blocks/Expertises'
import { founderQuotePlaceholder } from '@/blocks/FounderQuote'
import { statsPlaceholder } from '@/blocks/Stats'

/**
 * One-shot seed for a fresh database.
 *
 * Moves the content in `placeholder.ts` into Payload so the database becomes the
 * single source of truth.
 *
 *   GET /next/seed?secret=<PREVIEW_SECRET>
 *
 * Three guards, in order:
 *   1. Development only — this is a write endpoint and has no business being
 *      reachable on the public site.
 *   2. Requires PREVIEW_SECRET.
 *   3. Refuses to run when the global already has rows, so it cannot duplicate
 *      content if called twice.
 *
 * To seed a remote database, point DATABASE_URL at it and run this locally.
 */
export const dynamic = 'force-dynamic'

export async function GET(req: Request): Promise<Response> {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 })
  }

  const secret = new URL(req.url).searchParams.get('secret')

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new Response('Unauthorised', { status: 401 })
  }

  const payload = await getPayload({ config: await config })

  const seeded: string[] = []

  // --- stats -------------------------------------------------------------
  const existingStats = await payload.findGlobal({ slug: 'stats', depth: 0 })
  if (!existingStats.items?.length) {
    await payload.updateGlobal({ slug: 'stats', data: { items: statsPlaceholder.items } })
    await payload.updateGlobal({ slug: 'stats', data: { _status: 'published' } })
    seeded.push(`stats (${statsPlaceholder.items.length})`)
  }

  // --- founder quote -----------------------------------------------------
  // Above the services early-return below, so an existing site still picks this
  // up: the quote arrived long after the services did.
  const existingQuote = await payload.findGlobal({ slug: 'founder-quote', depth: 0 })
  if (!existingQuote.quote) {
    await payload.updateGlobal({
      slug: 'founder-quote',
      data: {
        quote: founderQuotePlaceholder.quote,
        authorName: founderQuotePlaceholder.author.name,
        authorRole: founderQuotePlaceholder.author.role,
      },
    })
    await payload.updateGlobal({ slug: 'founder-quote', data: { _status: 'published' } })
    seeded.push('founder-quote')
  }

  // --- certified products --------------------------------------------------
  // Also above the services early-return, for the same reason as the quote.
  const existingCerts = await payload.findGlobal({ slug: 'certifications', depth: 0 })
  if (!existingCerts.items?.length) {
    await payload.updateGlobal({
      slug: 'certifications',
      data: {
        badge: certificationsPlaceholder.badge,
        headingLines: certificationsPlaceholder.titleLines.map((text) => ({ text })),
        lede: certificationsPlaceholder.lede,
        items: certificationsPlaceholder.items,
      },
    })
    await payload.updateGlobal({ slug: 'certifications', data: { _status: 'published' } })
    seeded.push(`certifications (${certificationsPlaceholder.items.length})`)
  }

  // --- clients ---------------------------------------------------------
  const existingClients = await payload.count({ collection: 'clients' })
  if (existingClients.totalDocs === 0) {
    for (const [index, logo] of clientLogosPlaceholder.items.entries()) {
      const res = await fetch(logo.src)
      if (!res.ok) continue

      const data = Buffer.from(await res.arrayBuffer())
      const name = logo.src.split('/').pop() ?? 'logo.webp'

      const media = await payload.create({
        collection: 'media',
        data: { alt: logo.alt },
        file: {
          data,
          name,
          mimetype: res.headers.get('content-type') ?? 'image/webp',
          size: data.length,
        },
      })

      await payload.create({
        collection: 'clients',
        data: { name: logo.alt, logo: media.id, order: index + 1, _status: 'published' },
      })
    }
    seeded.push(`clients (${clientLogosPlaceholder.items.length})`)
  }

  // --- expertises: heading in the global, entries in the services collection --
  const existingServices = await payload.count({ collection: 'services' })
  if (existingServices.totalDocs > 0) {
    return Response.json(
      seeded.length
        ? { seeded: true, wrote: seeded, note: 'Services already exist and were skipped.' }
        : { seeded: false, reason: 'Nothing to do — content already exists.' },
      { status: seeded.length ? 200 : 409 },
    )
  }

  // The placeholder points at an absolute R2 URL. Pull the bytes and hand them
  // to Payload so the upload goes through the storage adapter like any other.
  const source = expertisesPlaceholder.items[0]?.image.src
  if (!source) return Response.json({ seeded: false, reason: 'No placeholder image' }, { status: 500 })

  const fileRes = await fetch(source)
  if (!fileRes.ok) {
    return Response.json(
      { seeded: false, reason: `Could not fetch ${source} (${fileRes.status})` },
      { status: 502 },
    )
  }

  const data = Buffer.from(await fileRes.arrayBuffer())
  const name = source.split('/').pop() ?? 'expertise.jpg'

  const media = await payload.create({
    collection: 'media',
    data: { alt: 'Bureaux cloisonnés — systèmes ABCD International' },
    file: {
      data,
      name,
      mimetype: fileRes.headers.get('content-type') ?? 'image/jpeg',
      size: data.length,
    },
  })

  // The global now holds only the section heading.
  await payload.updateGlobal({
    slug: 'expertises',
    data: {
      badge: expertisesPlaceholder.badge,
      headingLines: expertisesPlaceholder.headingLines.map((text) => ({ text })),
    },
  })
  await payload.updateGlobal({ slug: 'expertises', data: { _status: 'published' } })

  // Each entry is its own document, so projects can relate to them.
  for (const [index, item] of expertisesPlaceholder.items.entries()) {
    await payload.create({
      collection: 'services',
      data: {
        title: item.title,
        description: item.description,
        image: media.id,
        caption: item.image.caption,
        linkLabel: item.link?.label,
        linkHref: item.link?.href,
        order: index + 1,
        _status: 'published',
      },
    })
  }

  seeded.push(`services (${expertisesPlaceholder.items.length})`)

  return Response.json({
    seeded: true,
    wrote: seeded,
    mediaId: media.id,
    mediaUrl: media.url,
  })
}
