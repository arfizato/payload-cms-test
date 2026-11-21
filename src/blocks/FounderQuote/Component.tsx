import React from 'react'

import type { FounderQuoteProps } from './types'

/**
 * The founder's quote on /a-propos: an outlined card on an ink band.
 *
 * Server component.
 *
 * Built from the design's second version ("Quote section", under the À propos
 * frame), which answered feedback to make the quote bigger and easier to read:
 * the text went from ~18px to 24px, the card widened to 1060px, and the name
 * moved out of the card into a red plate sitting on its top edge, so it reads
 * as the caption before the quote rather than a footnote after it.
 *
 * The card repeats the band's own background rather than being transparent — it
 * has to mask the lattice behind it, which is what the design shows.
 *
 * The squares are decorative. Their positions are percentages of the band
 * rather than the design's pixel offsets, so the composition survives the
 * responsive padding instead of drifting out of frame.
 */
export const FounderQuote: React.FC<FounderQuoteProps> = ({ quote, author }) => {
  if (!quote) return null

  return (
    <section className="lattice relative overflow-hidden bg-ink px-gutter py-[clamp(72px,12.6vw,182px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Bottom left, at full strength in the design. */}
        <div className="absolute top-[80.7%] left-[8.9%] size-20 bg-accent/75" />
        <div className="absolute top-[92.9%] left-[3.3%] size-20 bg-accent/75" />
        {/* Top right, faint. */}
        <div className="absolute top-[7.5%] left-[87.2%] size-20 bg-accent/20" />
        <div className="absolute top-[7.5%] left-[92.8%] size-20 bg-accent/20" />
        <div className="absolute top-[19.8%] left-[92.8%] size-20 bg-accent/20" />
      </div>

      <figure className="relative mx-auto flex w-[1060px] max-w-full flex-col items-start">
        <figcaption className="flex flex-col gap-2.5 border border-accent bg-accent/[0.36] p-4 text-white">
          <span className="font-serif text-[clamp(1.125rem,1.5vw,1.335rem)] leading-none font-bold">
            {author.name}
          </span>
          {author.role && (
            <span className="text-[clamp(0.9375rem,1.3vw,1.168rem)] leading-none font-medium">
              {author.role}
            </span>
          )}
        </figcaption>

        <blockquote className="w-full border-[1.33px] border-accent bg-ink p-[clamp(20px,2.2vw,32px)] text-[clamp(1.125rem,1.67vw,1.5rem)] leading-[1.2] font-medium text-white shadow-[20px_14px_40px_rgba(0,0,0,0.08)]">
          {quote}
        </blockquote>
      </figure>
    </section>
  )
}
