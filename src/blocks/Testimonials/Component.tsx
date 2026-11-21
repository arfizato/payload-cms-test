import React from 'react'

import { SectionTag } from '@/components/SectionTag'

import { Carousel } from './Carousel'
import type { TestimonialsProps } from './types'

/**
 * "Témoignages clients" on the homepage, directly under Nos réalisations — the
 * placement feedback asked for, so the reader sees the work and then what the
 * clients said about it.
 *
 * Server component; only the carousel underneath it runs in the browser.
 */
export const Testimonials: React.FC<TestimonialsProps> = ({ badge, titleLines, lede, items }) => {
  if (items.length === 0) return null

  return (
    <section
      id="temoignages"
      className="bg-cream px-gutter py-[clamp(56px,8vw,117px)] text-ink"
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
          <p className="mt-2 max-w-[602px] text-[16px] leading-[1.2] font-medium">{lede}</p>
        )}

        <div className="mt-8">
          <Carousel items={items} />
        </div>
      </div>
    </section>
  )
}
