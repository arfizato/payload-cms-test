import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { ClientLogos, adaptClientLogos } from '@/blocks/ClientLogos'
import { Contact, adaptContact } from '@/blocks/Contact'
import { Footer, adaptFooter } from '@/blocks/Footer'
import { Hero } from '@/blocks/Hero'
import { adaptProjects, ProjectsGrid } from '@/blocks/Projects'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'
import { asset } from '@/utilities/asset'
import '../styles.css'

/**
 * Every project, not just the featured ones.
 *
 * Same chrome as the homepage — navbar, hero, client logos, contact, footer — with a
 * different hero image and copy. Static like `/`, and kept current by the same
 * revalidation hook, which lists this path.
 */
export const dynamic = 'force-static'

const hero = {
  badge: 'Nos projets',
  title: 'Des espaces qui parlent d’eux-mêmes.',
  lede: 'Plus de 1 000 projets livrés depuis 2008. Multinationales, banques, industrie, santé. Chaque réalisation est unique. Chaque espace raconte son client.',
  cta: { label: 'Découvrir nos réalisations', href: '#realisations' },
  image: {
    src: asset('/projects_hero.webp'),
    alt: 'Vue en plongée d’un escalier dans un espace de bureaux',
    // The atrium runs to the very bottom edge of the file, so a centred crop
    // slices it in half. Anchoring low keeps it whole.
    focalPoint: 'center bottom',
  },
}

export default async function ProjectsPage() {
  const payload = await getPayload({ config: await config })

  const [projectsResult, footerDoc, siteInfo, servicesResult, clientsResult] = await Promise.all([
    // No `featured` filter here — that is what separates this from the homepage.
    payload.find({ collection: 'projects', depth: 1, limit: 100, sort: 'order' }),
    payload.findGlobal({ slug: 'footer', depth: 0 }),
    payload.findGlobal({ slug: 'site-info', depth: 0 }),
    payload.find({ collection: 'services', depth: 0, limit: 20, sort: 'order' }),
    payload.find({ collection: 'clients', depth: 1, limit: 50, sort: 'order' }),
  ])

  const projects = adaptProjects(projectsResult.docs)

  return (
    <>
      <Navbar {...navbarPlaceholder} activeHref="/projets" />
      <Hero {...hero} />
      <ClientLogos {...adaptClientLogos(clientsResult.docs)} tone="dark" />
      <div id="realisations">
        <ProjectsGrid items={projects.items} />
      </div>
      <Contact {...adaptContact(siteInfo)} />
      <Footer {...adaptFooter(footerDoc, servicesResult.docs, siteInfo)} />
    </>
  )
}
