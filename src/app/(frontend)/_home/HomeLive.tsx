'use client'

import React from 'react'

import { adaptClientLogos } from '@/blocks/ClientLogos'
import { adaptContact } from '@/blocks/Contact'
import { adaptExpertises } from '@/blocks/Expertises'
import { adaptFooter } from '@/blocks/Footer'
import { adaptProjects } from '@/blocks/Projects'
import { adaptStats } from '@/blocks/Stats'
import { adaptTeamMembers } from '@/blocks/Team'
import { adaptTestimonials } from '@/blocks/Testimonials'
import type {
  Client as PayloadClient,
  Expertise as PayloadExpertises,
  Footer as PayloadFooter,
  Project as PayloadProject,
  Service as PayloadService,
  SiteInfo as PayloadSiteInfo,
  Stat as PayloadStats,
  TeamMember as PayloadTeamMember,
  Testimonial as PayloadTestimonial,
} from '@/payload-types'

import { HomeView } from './HomeView'
import { useGlobalPreview } from './useGlobalPreview'

type Props = {
  clients: PayloadClient[]
  expertisesDoc: PayloadExpertises
  footerDoc: PayloadFooter
  siteInfo: PayloadSiteInfo
  projects: PayloadProject[]
  services: PayloadService[]
  statsDoc: PayloadStats
  teamMembers: PayloadTeamMember[]
  testimonials: PayloadTestimonial[]
}

/**
 * Preview-only wrapper. Subscribes each global to the live-preview channel and
 * re-renders the same HomeView the public route uses, so the two cannot diverge.
 *
 * depth 1 on expertises matches the server fetch — adaptExpertises drops any row
 * whose image is not a populated object, so a shallower merge would blank the
 * carousel every time the editor typed.
 */
export const HomeLive: React.FC<Props> = ({
  clients,
  expertisesDoc,
  footerDoc,
  projects,
  services,
  siteInfo: siteInfoDoc,
  statsDoc,
  teamMembers,
  testimonials,
}) => {
  const expertises = useGlobalPreview<PayloadExpertises>('expertises', expertisesDoc, 1)
  const stats = useGlobalPreview<PayloadStats>('stats', statsDoc, 0)
  const footer = useGlobalPreview<PayloadFooter>('footer', footerDoc, 0)
  const siteInfo = useGlobalPreview<PayloadSiteInfo>('site-info', siteInfoDoc, 0)

  // Services, testimonials and team members are collections, so they arrive on the page's own live-preview
  // channel only when that document is the one being edited. Editing a service
  // reloads this route rather than streaming in, which is acceptable — the
  // heading and figures are what an editor tweaks repeatedly.
  return (
    <HomeView
      expertises={adaptExpertises(expertises, services)}
      clientLogos={adaptClientLogos(clients)}
      contact={adaptContact(siteInfo)}
      footer={adaptFooter(footer, services, siteInfo)}
      projects={adaptProjects(projects)}
      stats={adaptStats(stats)}
      team={adaptTeamMembers(teamMembers)}
      testimonials={adaptTestimonials(testimonials)}
    />
  )
}
