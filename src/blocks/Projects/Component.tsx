import React from 'react'

import { SectionTag } from '@/components/SectionTag'

import { Carousel } from './Carousel'
import type { ProjectsProps } from './types'

/**
 * "Nos réalisations". Server component — only the carousel's page state is
 * client-side, so the cards and images ship as static HTML.
 */
export const Projects: React.FC<ProjectsProps> = ({ badge, headingLines, cta, items }) => {
  if (items.length === 0) return null

  return (
    <section id="projets" className="bg-cream px-gutter py-[clamp(56px,7vw,96px)] text-ink">
      {badge && (
        <p className="mb-7">
          <SectionTag tone="light">{badge}</SectionTag>
        </p>
      )}

      <div className="mb-[clamp(28px,4vw,44px)] flex flex-wrap items-end justify-between gap-6">
        <h2 className="text-[clamp(1.9rem,3.4vw,3.2rem)] leading-[1.1] font-bold">
          {headingLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        {cta && (
          <a
            className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-[13px] font-semibold text-white transition hover:-translate-y-0.5"
            href={cta.href}
          >
            {cta.label}
            <svg width="12" height="12" viewBox="0 0 11 11" aria-hidden="true">
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
        )}
      </div>

      <Carousel items={items} />
    </section>
  )
}
