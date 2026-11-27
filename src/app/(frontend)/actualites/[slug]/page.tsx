import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { articleImage } from '@/blocks/Articles/Listing'
import { Contact, adaptContact } from '@/blocks/Contact'
import { Footer, adaptFooter } from '@/blocks/Footer'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'
import { SectionTag } from '@/components/SectionTag'
import type { Article } from '@/payload-types'
import config from '@/payload.config'
import '../../styles.css'

export const dynamic = 'force-dynamic'

const articleDate = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

const prose =
  'max-w-[1040px] text-[clamp(1rem,1.65vw,1.5rem)] leading-relaxed [&_p+p]:mt-4 [&_a]:underline [&_h2]:mt-8 [&_h2]:text-3xl [&_h3]:mt-6 [&_h3]:text-2xl [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6'

type ArticleSection = NonNullable<Article['sections']>[number]

function SectionImages({ images }: { images: ArticleSection['images'] }) {
  const photos = (images ?? []).flatMap(({ image, caption }) =>
    typeof image === 'object' && image?.url
      ? [{ id: image.id, src: image.url, alt: image.alt || '', caption }]
      : [],
  )

  if (!photos.length) return null

  return (
    <div className={`mt-6 grid gap-5 ${photos.length === 2 ? 'md:grid-cols-2' : ''}`}>
      {photos.map(({ id, src, alt, caption }, index) => (
        <figure key={`${id}-${index}`}>
          <div
            className={`relative overflow-hidden rounded-sm bg-ink/5 ${photos.length === 2 ? 'aspect-[4/3]' : 'aspect-[4/3] md:aspect-[2.5/1]'}`}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes={photos.length === 2 ? '(min-width: 768px) 47vw, 95vw' : '95vw'}
              className="object-cover"
            />
          </div>
          {caption && <figcaption className="mt-2 text-sm text-ink/70">{caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })
  const {
    docs: [article],
  } = await payload.find({
    collection: 'articles',
    limit: 1,
    depth: 1,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })

  if (!article) notFound()

  const sections = article.sections ?? []
  const category = typeof article.category === 'object' ? article.category : null
  const relatedQuery = {
    collection: 'articles',
    depth: 1,
    limit: 3,
    sort: ['-publishedAt', '-id'],
    where: { _status: { equals: 'published' }, id: { not_equals: article.id } },
  } as const
  const [footer, siteInfo, { docs: services }, recent, sameCategory] = await Promise.all([
    payload.findGlobal({ slug: 'footer', depth: 0 }),
    payload.findGlobal({ slug: 'site-info', depth: 0 }),
    payload.find({ collection: 'services', depth: 0, limit: 20, sort: 'order' }),
    payload.find({ ...relatedQuery, sort: [...relatedQuery.sort] }),
    category &&
      payload.find({
        ...relatedQuery,
        sort: [...relatedQuery.sort],
        where: { ...relatedQuery.where, category: { equals: category.id } },
      }),
  ])
  const sameCategoryArticles = sameCategory?.docs ?? []
  const related = sameCategoryArticles
    .concat(recent.docs.filter(({ id }) => !sameCategoryArticles.some((item) => item.id === id)))
    .slice(0, 3)

  const bodyText = sections.length
    ? sections
        .map(({ title, body }) => `${title} ${convertLexicalToPlaintext({ data: body })}`)
        .join(' ')
    : article.body
      ? convertLexicalToPlaintext({ data: article.body })
      : ''
  const words = `${article.excerpt} ${bodyText}`.trim().split(/\s+/).length
  const readingMinutes = Math.max(1, Math.ceil(words / 220))
  const heroMedia = typeof article.detailImage === 'object' ? article.detailImage : null
  const hero = heroMedia?.url
    ? { src: heroMedia.url, alt: heroMedia.alt || '' }
    : articleImage(article)

  return (
    <>
      <div className="relative h-[86px] bg-ink">
        <Navbar {...navbarPlaceholder} activeHref="/actualites" />
      </div>
      <article className="bg-cream px-gutter py-[clamp(40px,4.5vw,64px)] text-ink">
        <header className="mx-auto max-w-[1440px]">
          <Link href="/actualites#articles" className="text-sm font-medium hover:underline">
            ← Toutes les actualités
          </Link>
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.74fr_1fr] lg:gap-[clamp(24px,4vw,56px)]">
            <h1 className="text-[clamp(2.75rem,6.6vw,6rem)] leading-[1.02] font-bold text-navy">
              {article.title}
            </h1>
            <div>
              {category && (
                <p className="inline-flex items-center gap-2 font-medium text-accent">
                  <span className="size-3 bg-accent" aria-hidden="true" />
                  {category.title}
                </p>
              )}
              <p className="mt-4 text-[clamp(1.125rem,1.7vw,1.5rem)] leading-relaxed">
                {article.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-sm font-medium">
                <time dateTime={article.publishedAt}>
                  {articleDate.format(new Date(article.publishedAt))}
                </time>
                <span>{readingMinutes} min de lecture</span>
              </div>
            </div>
          </div>
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-sm md:mt-16 md:aspect-[1362/620]">
            <Image {...hero} fill priority sizes="95vw" className="object-cover" />
          </div>
        </header>

        <div className="mx-auto mt-[clamp(48px,8vw,128px)] max-w-[1440px] space-y-[clamp(40px,6vw,88px)]">
          {sections.map((section, index) => (
            <section key={section.id ?? index}>
              <h2 className="mb-4 flex items-start gap-3 font-sans text-[clamp(1.25rem,1.7vw,1.5rem)] leading-tight font-bold text-accent">
                <span className="mt-1 size-4 flex-none bg-accent md:size-6" aria-hidden="true" />
                {section.title}
              </h2>
              <RichText data={section.body} className={prose} />
              <SectionImages images={section.images} />
            </section>
          ))}
          {!sections.length && article.body && <RichText data={article.body} className={prose} />}
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-cream px-gutter py-[clamp(48px,5vw,80px)] text-navy">
          <div className="mx-auto max-w-[1440px]">
            <SectionTag tone="light">Blog</SectionTag>
            <div className="mt-3 mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(2.25rem,4vw,4rem)] leading-tight font-bold">
                À lire aussi
              </h2>
              <Link
                href="/actualites#articles"
                className="text-sm font-medium underline underline-offset-4"
              >
                Voir toutes les actualités
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.id} href={`/actualites/${item.slug}`} className="group">
                  <div className="relative aspect-[437/253] overflow-hidden rounded-sm">
                    <Image
                      {...articleImage(item)}
                      fill
                      sizes="(min-width: 768px) 31vw, 95vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-4 font-sans text-xl font-semibold group-hover:underline">
                    {item.title}
                  </h3>
                  <span className="mt-2 inline-block text-sm uppercase">Lire</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <Contact {...adaptContact(siteInfo)} />
      <Footer {...adaptFooter(footer, services, siteInfo)} />
    </>
  )
}
