import Image from 'next/image'
import React from 'react'

import type { TeamMember } from './types'

/**
 * A square portrait with the name and role set over an ink fade at its foot,
 * as in the design. No hooks, so it renders on either side of the boundary.
 */
export const MemberCard: React.FC<{ member: TeamMember; sizes: string }> = ({
  member,
  sizes,
}) => (
  <figure className="relative aspect-square overflow-hidden rounded-[4px] bg-ink/10">
    <Image className="object-cover" src={member.photo.src} alt={member.photo.alt} fill sizes={sizes} />

    {/* The design's 159px fade on a 344px card: the lower ~46%. */}
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-[46%] bg-linear-to-b from-ink/0 to-ink"
    />

    <figcaption className="absolute inset-x-0 bottom-0 flex flex-col p-[19px] text-[14px] leading-[20px] font-semibold text-cream">
      <span>{member.name}</span>
      {member.role && <span className="font-medium text-cream/85">{member.role}</span>}
    </figcaption>
  </figure>
)
