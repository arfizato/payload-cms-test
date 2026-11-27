import { getPayload } from 'payload'

import { ArticleListing } from '@/blocks/Articles/Listing'
import { ClientLogos, adaptClientLogos } from '@/blocks/ClientLogos'
import { Contact, adaptContact } from '@/blocks/Contact'
import { Footer, adaptFooter } from '@/blocks/Footer'
import { Hero } from '@/blocks/Hero'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'
import config from '@/payload.config'
import { asset } from '@/utilities/asset'
import '../styles.css'

export const dynamic = 'force-dynamic'

const hero = {
  badge: 'Actualités',
  title: 'Ce que nous observons, testons et recommandons.',
  lede: 'L’espace professionnel évolue. Tendances workspace, expertises techniques, nouveaux matériaux et retours d’expérience terrain, notre équipe partage ce qu’elle sait.',
  cta: { label: 'Voir toutes les actualités', href: '#articles' },
  image: {
    src: asset('/actuality-hero.webp'),
    mobileSrc: asset('/actuality-hero-mobile.webp'),
    alt: '',
  },
}

export default async function ActualitesPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; articles?: string }>
}) {
  const { categorie, articles } = await searchParams
  const requested = Number(articles)
  const visible = Number.isSafeInteger(requested) && requested >= 6 ? requested : undefined
  const payload = await getPayload({ config: await config })

  const [footerDoc, siteInfo, servicesResult, clientsResult, { docs: categories }] =
    await Promise.all([
      payload.findGlobal({ slug: 'footer', depth: 0 }),
      payload.findGlobal({ slug: 'site-info', depth: 0 }),
      payload.find({ collection: 'services', depth: 0, limit: 20, sort: 'order' }),
      payload.find({ collection: 'clients', depth: 1, limit: 50, sort: 'order' }),
      payload.find({ collection: 'article-categories', depth: 0, pagination: false, sort: 'id' }),
    ])
  const active = categories.find((category) => String(category.id) === categorie)
  const result = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: visible ?? 6,
    sort: ['-publishedAt', '-id'],
    where: {
      _status: { equals: 'published' },
      ...(active && { category: { equals: active.id } }),
    },
  })

  return (
    <>
      <Navbar {...navbarPlaceholder} activeHref="/actualites" />
      <Hero {...hero} />
      <ClientLogos {...adaptClientLogos(clientsResult.docs)} tone="dark" />
      <ArticleListing
        articles={result.docs}
        categories={categories}
        active={active}
        total={result.totalDocs}
        visible={visible}
      />
      <Contact {...adaptContact(siteInfo)} />
      <Footer {...adaptFooter(footerDoc, servicesResult.docs, siteInfo)} />
    </>
  )
}
