import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { ClientLogos, adaptClientLogos } from '@/blocks/ClientLogos'
import { Contact, adaptContact } from '@/blocks/Contact'
import { Footer, adaptFooter } from '@/blocks/Footer'
import { Hero } from '@/blocks/Hero'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'
import { asset } from '@/utilities/asset'
import '../styles.css'

/**
 * "Parlons de votre projet" — the navbar's call to action.
 *
 * Same chrome as /projets and /metiers, and the form itself is the Contact block
 * the homepage already renders, so there is one form to maintain rather than a
 * second copy that drifts. Static, and listed in `revalidateHome`'s PATHS so the
 * address and the client band here rebuild with everything else.
 */
export const dynamic = 'force-static'

/** Hardcoded like the other page heroes: this is typography, not editable copy. */
const hero = {
  badge: 'Contact',
  title: 'Parlons de votre projet.',
  lede: 'Notre équipe vous répond sous 48h. Décrivez-nous vos besoins et nous revenons vers vous avec une première approche adaptée.',
  // Scrolls to the form below rather than leaving the page.
  cta: { label: 'Parlons de votre projet', href: '#contact' },
  image: {
    src: asset('/contact-hero.webp'),
    alt: 'Bureaux cloisonnés de verre le long d’un couloir',
  },
}

export default async function ContactPage() {
  const payload = await getPayload({ config: await config })

  const [footerDoc, siteInfo, servicesResult, clientsResult] = await Promise.all([
    payload.findGlobal({ slug: 'footer', depth: 0 }),
    payload.findGlobal({ slug: 'site-info', depth: 0 }),
    payload.find({ collection: 'services', depth: 0, limit: 20, sort: 'order' }),
    payload.find({ collection: 'clients', depth: 1, limit: 50, sort: 'order' }),
  ])

  return (
    <>
      <Navbar {...navbarPlaceholder} activeHref="/contact" />
      <Hero {...hero} />
      <ClientLogos {...adaptClientLogos(clientsResult.docs)} tone="dark" />
      <Contact {...adaptContact(siteInfo)} />
      <Footer {...adaptFooter(footerDoc, servicesResult.docs, siteInfo)} />
    </>
  )
}
