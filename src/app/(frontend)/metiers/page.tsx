import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { ClientLogos, adaptClientLogos } from '@/blocks/ClientLogos'
import { Contact, adaptContact } from '@/blocks/Contact'
import { Footer, adaptFooter } from '@/blocks/Footer'
import { Hero } from '@/blocks/Hero'
import { Metiers, adaptMetiers } from '@/blocks/Metiers'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'
import { asset } from '@/utilities/asset'
import '../styles.css'

/**
 * "Nos métiers".
 *
 * Same chrome as /projets — navbar, hero, client logos, contact, footer — with its own
 * hero image and copy. Static, and listed in `revalidateHome`'s PATHS so the
 * client band here rebuilds with everything else.
 *
 * Below the band, one row per métier, driven by the Services collection — so
 * adding a métier in the admin adds a row here and a tag option on projects,
 * with no code change.
 */
export const dynamic = 'force-static'

/**
 * Hardcoded like the /projets hero, by the same decision: this is the page's
 * typography, not content an editor should be able to reflow.
 *
 * One catch worth knowing — "Six Expertises" is a literal. The Services
 * collection decides how many there actually are, so publishing a seventh métier
 * makes this line wrong and nothing will warn anyone.
 */
const hero = {
  badge: 'Nos métiers',
  title: 'Six Expertises. Une Seule Responsabilité.',
  lede: 'Groupe BigArt est le seul acteur en Tunisie à couvrir l’intégralité de la chaîne d’aménagement professionnel — de la conception à la pose terrain, avec des produits certifiés européens.',
  // No CTA in this frame; the hero ends on the lede.
  image: {
    src: asset('/metiers_hero.webp'),
    alt: 'Pose d’une cloison vitrée dans un espace de bureaux',
  },
}

export default async function MetiersPage() {
  const payload = await getPayload({ config: await config })

  const [footerDoc, siteInfo, servicesResult, clientsResult] = await Promise.all([
    payload.findGlobal({ slug: 'footer', depth: 0 }),
    payload.findGlobal({ slug: 'site-info', depth: 0 }),
    // depth 1 populates the uploads inside `gallery`; the footer only needs the
    // titles from the same result.
    payload.find({ collection: 'services', depth: 1, limit: 20, sort: 'order' }),
    payload.find({ collection: 'clients', depth: 1, limit: 50, sort: 'order' }),
  ])

  return (
    <>
      <Navbar {...navbarPlaceholder} activeHref="/metiers" />
      <Hero {...hero} />
      <ClientLogos {...adaptClientLogos(clientsResult.docs)} tone="dark" />
      <Metiers {...adaptMetiers(servicesResult.docs)} />
      <Contact {...adaptContact(siteInfo)} />
      <Footer {...adaptFooter(footerDoc, servicesResult.docs, siteInfo)} />
    </>
  )
}
