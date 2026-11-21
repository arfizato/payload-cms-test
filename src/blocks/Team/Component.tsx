import React from 'react'

import { SectionTag } from '@/components/SectionTag'

import { Grid } from './Grid'
import { MemberCard } from './MemberCard'
import type { TeamProps } from './types'

/**
 * "Notre équipe" — on the homepage as a teaser row, on /a-propos in full.
 *
 * One component with two looks, per docs/content-architecture.md ("one section,
 * several looks → variant"): the data is the same list of people, only how
 * many show and what sits under them changes.
 *
 * Server component. The teaser is static; only the full grid's "Voir plus" runs
 * in the browser.
 */
export const Team: React.FC<TeamProps> = ({
  badge,
  titleLines,
  lede,
  members,
  variant = 'full',
  initialCount,
  cta,
}) => {
  if (members.length === 0) return null

  const teaser = variant === 'teaser'

  return (
    <section
      // /a-propos's members are what the homepage's "Découvrir toute l'équipe"
      // points at, so that one carries the anchor.
      id={teaser ? undefined : 'equipe'}
      className="bg-cream px-gutter py-[clamp(56px,7vw,99px)] text-ink"
    >
      <div className="mx-auto max-w-[1358px]">
        {badge && (
          <p className="mb-2">
            <SectionTag tone="light">{badge}</SectionTag>
          </p>
        )}

        {titleLines.length > 0 && (
          <h2 className="text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.23] font-bold">
            {titleLines.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </h2>
        )}

        {lede && (
          <p className="mt-2 max-w-[764px] text-[16px] leading-[1.2] font-medium">{lede}</p>
        )}

        <div className="mt-8">
          {teaser ? (
            <ul className="m-0 grid list-none grid-cols-2 gap-[clamp(8px,1.7vw,24px)] p-0 lg:grid-cols-4">
              {members.slice(0, initialCount ?? 4).map((member) => (
                <li key={member.name}>
                  <MemberCard member={member} sizes="(max-width: 1024px) 50vw, 25vw" />
                </li>
              ))}
            </ul>
          ) : (
            <Grid members={members} initialCount={initialCount ?? 8} />
          )}
        </div>

        {cta && (
          <p className="mt-8 flex justify-center">
            <a
              className="inline-flex h-11 items-center gap-2 rounded-md bg-ink px-5 text-[14px] font-semibold text-cream transition hover:-translate-y-0.5"
              href={cta.href}
            >
              {cta.label}
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 11 11">
                <path
                  d="M1.5 9.5L9.5 1.5M9.5 1.5H3.5M9.5 1.5V7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </p>
        )}
      </div>
    </section>
  )
}
