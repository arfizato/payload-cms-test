import { draftMode } from 'next/headers'
import React from 'react'

import { getHomeDocs } from '../_home/getHomeData'
import { HomeLive } from '../_home/HomeLive'
import '../styles.css'

/**
 * The editor-facing homepage, loaded inside the admin's live-preview iframe.
 *
 * Renders the same HomeView as `/`, but seeded with draft content and wrapped in
 * HomeLive, which subscribes to the admin's live-preview channel so edits appear
 * without a reload.
 *
 * Dynamic because it reads the draft cookie — which is fine here, since only the
 * editor loads this route and its latency does not affect visitors.
 */
export const dynamic = 'force-dynamic'

export default async function PreviewPage() {
  const { isEnabled: draft } = await draftMode()
  const {
    clients,
    expertisesDoc,
    footerDoc,
    projects,
    services,
    siteInfo,
    statsDoc,
    teamMembers,
    testimonials,
  } = await getHomeDocs({ draft })

  return (
    <HomeLive
      clients={clients}
      expertisesDoc={expertisesDoc}
      footerDoc={footerDoc}
      siteInfo={siteInfo}
      projects={projects}
      services={services}
      statsDoc={statsDoc}
      teamMembers={teamMembers}
      testimonials={testimonials}
    />
  )
}
