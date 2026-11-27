import { getPayload } from 'payload'

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
  image: {
    src: asset('/actuality-hero.webp'),
    mobileSrc: asset('/actuality-hero-mobile.webp'),
    alt: '',
  },
}

export default async function ActualitesPage() {
  const payload = await getPayload({ config: await config })

  const [footerDoc, siteInfo, servicesResult, clientsResult] = await Promise.all([
    payload.findGlobal({ slug: 'footer', depth: 0 }),
    payload.findGlobal({ slug: 'site-info', depth: 0 }),
    payload.find({ collection: 'services', depth: 0, limit: 20, sort: 'order' }),
    payload.find({ collection: 'clients', depth: 1, limit: 50, sort: 'order' }),
  ])

  return (
    <>
      <Navbar {...navbarPlaceholder} activeHref="/actualites" />
      <Hero {...hero} />
      <ClientLogos {...adaptClientLogos(clientsResult.docs)} tone="dark" />
      <Contact {...adaptContact(siteInfo)} />
      <Footer {...adaptFooter(footerDoc, servicesResult.docs, siteInfo)} />
    </>
  )
}
