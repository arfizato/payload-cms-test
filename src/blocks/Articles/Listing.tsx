import Image from 'next/image'
import Link from 'next/link'

import { SectionTag } from '@/components/SectionTag'
import type { Article, ArticleCategory } from '@/payload-types'

const dateFormat = new Intl.DateTimeFormat('fr-TN', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const desktopImageRatios = ['lg:aspect-[437/591]', 'lg:aspect-[437/733]', 'lg:aspect-[404/442]']

export function articleImage(article: Article) {
  const image = typeof article.image === 'object' ? article.image : null
  return { src: image?.url || '/about-hero.webp', alt: image?.alt || '' }
}

function listingHref(category?: number | string, visible?: number) {
  const params = new URLSearchParams()
  if (category !== undefined) params.set('categorie', String(category))
  if (visible !== undefined) params.set('articles', String(visible))
  return `/actualites${params.size ? `?${params}` : ''}#articles`
}

type ListingProps = {
  articles: Article[]
  categories: ArticleCategory[]
  active?: ArticleCategory
  total: number
  visible?: number
}

export function ArticleListing({ articles, categories, active, total, visible }: ListingProps) {
  const filters = [{ id: undefined, title: 'Tous les articles' }, ...categories]

  return (
    <section
      id="articles"
      className="scroll-mt-4 bg-cream px-gutter py-[clamp(48px,4.5vw,64px)] text-navy"
    >
      <SectionTag tone="light">Blog</SectionTag>
      <h2 className="mt-2 text-[clamp(2.5rem,5vw,4rem)] leading-tight font-bold">Actualités</h2>

      <nav
        aria-label="Catégories d’articles"
        className="mt-6 mb-[clamp(32px,4.5vw,64px)] flex flex-wrap gap-2"
      >
        {filters.map(({ id, title }) => {
          const selected = active?.id === id
          return (
            <Link
              key={id ?? 'all'}
              href={listingHref(id)}
              aria-current={selected ? 'true' : undefined}
              className={`inline-flex min-h-11 items-center rounded-md border px-4 text-sm font-medium transition-colors md:px-6 ${selected ? 'border-accent bg-accent text-white' : 'border-navy/30 hover:border-navy'}`}
            >
              {title}
            </Link>
          )
        })}
      </nav>

      {articles.length ? (
        <div className="grid gap-x-[clamp(24px,2.8vw,40px)] gap-y-10 md:grid-cols-2 lg:grid-cols-[1fr_1fr_0.925fr]">
          {articles.map((article, index) => {
            const category = typeof article.category === 'object' ? article.category : null
            return (
              <article
                key={article.id}
                className={`min-w-0 ${index === 1 ? 'lg:mt-10' : ''} ${visible === undefined && index >= 3 ? 'hidden md:block' : ''}`}
              >
                <div
                  className={`relative aspect-square overflow-hidden rounded-sm bg-ink/5 ${desktopImageRatios[index % 3]}`}
                >
                  <Image
                    {...articleImage(article)}
                    fill
                    sizes="(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 96vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                  {category && (
                    <span className="inline-flex items-center gap-2 text-accent">
                      <span className="size-3 bg-accent" aria-hidden="true" />
                      {category.title}
                    </span>
                  )}
                  <time dateTime={article.publishedAt}>
                    {dateFormat.format(new Date(article.publishedAt))}
                  </time>
                </p>
                <h3 className="mt-2 font-sans text-[clamp(1.25rem,2vw,1.75rem)] leading-tight font-semibold">
                  {article.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed">{article.excerpt}</p>
                <Link
                  className="mt-4 inline-flex text-sm font-medium uppercase hover:underline"
                  href={`/actualites/${article.slug}`}
                >
                  Lire l’article<span className="sr-only"> {article.title}</span>
                </Link>
              </article>
            )
          })}
        </div>
      ) : (
        <p>Aucun article pour le moment.</p>
      )}

      {(total > articles.length || (visible === undefined && total > 3)) && (
        <div className="mt-12 flex justify-center">
          {visible === undefined && total > 3 && (
            <MoreLink href={listingHref(active?.id, 6)} className="inline-flex md:hidden" />
          )}
          {total > articles.length && (
            <MoreLink
              href={listingHref(active?.id, articles.length + 6)}
              className={visible === undefined ? 'hidden md:inline-flex' : 'inline-flex'}
            />
          )}
        </div>
      )}
    </section>
  )
}

function MoreLink({ href, className }: { href: string; className: string }) {
  return (
    <Link
      href={href}
      className={`h-11 w-full max-w-[436px] items-center justify-center gap-2 rounded-md border border-ink text-sm font-semibold text-ink hover:bg-ink hover:text-cream ${className}`}
    >
      Voir plus <span aria-hidden="true">↓</span>
    </Link>
  )
}
