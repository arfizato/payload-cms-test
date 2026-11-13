import React from 'react'

import type { FounderQuoteProps } from './types'

/**
 * The founder's quote on /a-propos: an outlined card on an ink band.
 *
 * Server component. The card repeats the band's own background rather than
 * being transparent — it has to mask the lattice behind it, which is what the
 * design shows.
 *
 * The six squares are decorative. Their positions are percentages of the band
 * rather than the design's pixel offsets, so the composition survives the
 * responsive padding instead of drifting out of frame.
 */
export const FounderQuote: React.FC<FounderQuoteProps> = ({ quote, author }) => {
  if (!quote) return null

  return (
    <section className="lattice relative overflow-hidden bg-ink px-gutter py-[clamp(64px,14.5vw,210px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Bottom left, at full strength in the design. */}
        <div className="absolute top-[76.7%] left-[8.9%] size-20 bg-accent/75" />
        <div className="absolute top-[88.8%] left-[3.3%] size-20 bg-accent/75" />
        <div className="absolute top-[101%] left-[8.9%] size-20 bg-accent/75" />
        {/* Top right, faint. */}
        <div className="absolute top-[19.8%] left-[81.7%] size-20 bg-accent/20" />
        <div className="absolute top-[19.8%] left-[87.3%] size-20 bg-accent/20" />
        <div className="absolute top-[31.9%] left-[87.3%] size-20 bg-accent/20" />
      </div>

      <figure className="relative mx-auto flex min-h-[242px] w-[750px] max-w-full items-center border border-accent bg-ink p-6 shadow-[20px_14px_40px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col items-start gap-4">
          <blockquote className="text-[clamp(1rem,1.4vw,1.25rem)] leading-normal font-medium text-white">
            {quote}
          </blockquote>

          <figcaption className="flex flex-col gap-2.5 bg-accent/[0.16] p-2 text-accent">
            <span className="font-serif text-[16px] leading-[12px] font-bold">{author.name}</span>
            {author.role && (
              <span className="text-[14px] leading-[8px] font-medium">{author.role}</span>
            )}
          </figcaption>
        </div>
      </figure>
    </section>
  )
}
