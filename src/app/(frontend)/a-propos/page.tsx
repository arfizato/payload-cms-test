import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { ClientLogos, adaptClientLogos } from '@/blocks/ClientLogos'
import { Contact, adaptContact } from '@/blocks/Contact'
import { Footer, adaptFooter } from '@/blocks/Footer'
import { Hero } from '@/blocks/Hero'
import { Stats, adaptStats } from '@/blocks/Stats'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'
import { asset } from '@/utilities/asset'
import '../styles.css'

/**
 * "À propos" — the company story page.
 *
 * First pass: the chrome only. Navbar, hero, client logos, contact, stats and
 * footer are the blocks the other pages already share, so this route is
 * deliberately thin. The narrative sections in the design — Notre histoire, the
 * CEO quote, Mission & Vision, Nos valeurs, Quatre entités, Des produits
 * certifiés and Notre équipe — land in later passes, one section at a time.
 *
 * Static like /projets and /metiers, and listed in `revalidateHome`'s PATHS so
 * the client band and the stats here rebuild with everything else.
 */
export const dynamic = 'force-static'

/**
 * Hardcoded like the other page heroes: this is typography, not editable copy.
 *
 * The photo is the one in the Figma frame, exported at 2400px and converted to
 * webp. Unlike the other heroes it is not anchored low — the faces sit near the
 * vertical middle of the frame, and the default `center 62%` crops them.
 */
const hero = {
  badge: 'À propos',
  title: 'Du brief à la livraison, nous orchestrons chaque dimension de votre espace.',
  lede: 'Fondé en 2008 à Ariana, Groupe BigArt est le seul acteur en Tunisie à intégrer conception, fourniture de produits certifiés européens et réalisation terrain sous un même toit.',
  // No CTA in this frame; the hero ends on the lede, as on /metiers.
  image: {
    src: asset('/about-hero.webp'),
    alt: 'Quatre collaborateurs réunis autour d’un ordinateur portable dans une salle de réunion',
    focalPoint: 'center',
  },
}

export default async function AboutPage() {
  const payload = await getPayload({ config: await config })

  const [footerDoc, siteInfo, servicesResult, clientsResult, statsDoc] = await Promise.all([
    payload.findGlobal({ slug: 'footer', depth: 0 }),
    payload.findGlobal({ slug: 'site-info', depth: 0 }),
    // The footer only needs the titles, so depth 0 is enough here.
    payload.find({ collection: 'services', depth: 0, limit: 20, sort: 'order' }),
    payload.find({ collection: 'clients', depth: 1, limit: 50, sort: 'order' }),
    payload.findGlobal({ slug: 'stats', depth: 0 }),
  ])

  return (
    <>
      <Navbar {...navbarPlaceholder} activeHref="/a-propos" />
      <Hero {...hero} />
      <ClientLogos {...adaptClientLogos(clientsResult.docs)} />
      <Contact {...adaptContact(siteInfo)} />
      {/* The design places the stats band low on this page, above the footer —
          not under the hero as on the homepage. */}
      <Stats {...adaptStats(statsDoc)} />
      <Footer {...adaptFooter(footerDoc, servicesResult.docs, siteInfo)} />
    </>
  )
}
