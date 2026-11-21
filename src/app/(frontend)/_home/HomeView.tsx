import React from 'react'

import { ClientLogos } from '@/blocks/ClientLogos'
import { Contact } from '@/blocks/Contact'
import { Footer } from '@/blocks/Footer'
import { Expertises } from '@/blocks/Expertises'
import { Hero, heroPlaceholder } from '@/blocks/Hero'
import { News, newsPlaceholder } from '@/blocks/News'
import { Projects } from '@/blocks/Projects'
import { Stats } from '@/blocks/Stats'
import { Team, teamHomePlaceholder } from '@/blocks/Team'
import { Testimonials, testimonialsPlaceholder } from '@/blocks/Testimonials'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'

import type { HomeData } from './getHomeData'

/**
 * The homepage markup, rendered identically by the public and preview routes.
 *
 * Navbar, Hero and ClientLogos are still placeholder-driven — see backlog item 7.
 * Testimonials and Team are new and placeholder-driven too: design first, wired
 * to collections once the design is approved.
 */
export const HomeView: React.FC<HomeData> = ({ clientLogos, contact, expertises, footer, projects, stats }) => (
  <>
    <Navbar {...navbarPlaceholder} />
    <Hero {...heroPlaceholder} />
    <ClientLogos {...clientLogos} />
    <Stats {...stats} />
    <Expertises {...expertises} />
    <Projects {...projects} />
    <Testimonials {...testimonialsPlaceholder} />
    <Team {...teamHomePlaceholder} />
    <News {...newsPlaceholder} />
    <Contact {...contact} />
    <Footer {...footer} />
  </>
)
