import React from 'react'

import { ClientLogos } from '@/blocks/ClientLogos'
import { Contact } from '@/blocks/Contact'
import { Footer } from '@/blocks/Footer'
import { Expertises } from '@/blocks/Expertises'
import { Hero, heroPlaceholder } from '@/blocks/Hero'
import { News, newsPlaceholder } from '@/blocks/News'
import { Projects } from '@/blocks/Projects'
import { Stats } from '@/blocks/Stats'
import { Team } from '@/blocks/Team'
import { Testimonials } from '@/blocks/Testimonials'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'

import type { HomeData } from './getHomeData'

/**
 * The homepage team teaser's heading and link. Fixed copy, like the other
 * sections' chrome; the people come from the `team-members` collection.
 */
const TEAM_TEASER = {
  badge: 'Notre équipe',
  titleLines: ['Les personnes', 'derrière vos projets.'],
  lede: 'Plus de 20 experts avec une moyenne de 10 ans d’expérience dans l’espace professionnel, entièrement dédiés à la réussite de votre projet.',
  variant: 'teaser' as const,
  initialCount: 4,
  cta: { label: 'Découvrir toute l’équipe', href: '/a-propos#equipe' },
}

/**
 * The homepage markup, rendered identically by the public and preview routes.
 *
 * Navbar and Hero are still placeholder-driven — see backlog item 7.
 */
export const HomeView: React.FC<HomeData> = ({
  clientLogos,
  contact,
  expertises,
  footer,
  projects,
  stats,
  team,
  testimonials,
}) => (
  <>
    <Navbar {...navbarPlaceholder} />
    <Hero {...heroPlaceholder} />
    <ClientLogos {...clientLogos} />
    <Stats {...stats} />
    <Expertises {...expertises} />
    <Projects {...projects} />
    <Testimonials {...testimonials} />
    <Team {...TEAM_TEASER} members={team} />
    <News {...newsPlaceholder} />
    <Contact {...contact} />
    <Footer {...footer} />
  </>
)
