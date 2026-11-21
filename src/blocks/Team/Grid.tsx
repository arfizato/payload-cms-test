'use client'

import React, { useState } from 'react'

import { LoadMoreButton } from '@/components/LoadMoreButton'

import { MemberCard } from './MemberCard'
import type { TeamMember } from './types'

const GRID_ID = 'equipe-grid'

const SIZES = '(max-width: 768px) 50vw, 25vw'

/**
 * /a-propos's team grid. Feedback asked for "Voir plus" to load the rest on the
 * same page rather than going anywhere, so this is the one client-side piece of
 * the section: it only decides how many of the already-rendered members show.
 */
export const Grid: React.FC<{ members: TeamMember[]; initialCount: number }> = ({
  members,
  initialCount,
}) => {
  const [shown, setShown] = useState(initialCount)

  return (
    <>
      <ul
        id={GRID_ID}
        className="m-0 grid list-none grid-cols-2 gap-2 p-0 lg:grid-cols-4"
      >
        {members.slice(0, shown).map((member) => (
          <li key={member.name}>
            <MemberCard member={member} sizes={SIZES} />
          </li>
        ))}
      </ul>

      {members.length > shown && (
        <LoadMoreButton controls={GRID_ID} onClick={() => setShown((n) => n + initialCount)} />
      )}
    </>
  )
}
