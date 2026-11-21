import React from 'react'

import { SectionTag } from '@/components/SectionTag'

import type { EntitiesProps } from './types'

/**
 * "L'écosystème du groupe" on /a-propos: four entity cards on an ink band.
 *
 * Server component.
 *
 * The rows are deliberately lopsided — the design splits the first roughly
 * evenly and the second about 41/59 — so the cards are laid out two at a time
 * rather than in one four-up grid. Any row beyond the second repeats the first
 * row's split, so an odd count still lands somewhere sensible.
 *
 * Each card leads with the entity's name and tagline and lets the description
 * settle at the foot, which is why it is a flex column with a floor rather
 * than stacked margins. It used to be the other way round; feedback was that
 * the cards were too dark to read and the names should come first.
 *
 * The tints are radial glows defined in styles.css (`.entity-glow--*`) — a
 * circle of red rising from a corner, redder than the diagonal wash they
 * replaced.
 */
const ROW_TEMPLATES = ['grid-cols-[686fr_655fr]', 'grid-cols-[546fr_798fr]']

const TINTS = {
  accent: 'entity-glow--accent',
  ember: 'entity-glow--ember',
}

export const Entities: React.FC<EntitiesProps> = ({ badge, titleLines, lede, items }) => {
  if (items.length === 0) return null

  const rows = Array.from({ length: Math.ceil(items.length / 2) }, (_, i) =>
    items.slice(i * 2, i * 2 + 2),
  )

  return (
    <section className="lattice relative overflow-hidden bg-ink px-gutter py-[clamp(64px,10vw,144px)] text-cream">
      <div className="relative mx-auto max-w-[1354px]">
        {badge && (
          <p className="mb-7">
            <SectionTag tone="ink">{badge}</SectionTag>
          </p>
        )}

        {titleLines.length > 0 && (
          <h2 className="text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.2] font-bold">
            {titleLines.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </h2>
        )}

        {lede && (
          <p className="mt-[clamp(20px,2.2vw,32px)] max-w-[100ch] text-[15px] leading-[1.5] font-semibold text-cream/90">
            {lede}
          </p>
        )}

        <div className="mt-[clamp(28px,3.3vw,48px)] grid gap-[14px]">
          {rows.map((row, rowIndex) => (
            <div
              className={`grid gap-[13px] max-nav:grid-cols-1 ${
                ROW_TEMPLATES[rowIndex % ROW_TEMPLATES.length]
              }`}
              key={row.map((item) => item.name).join('|')}
            >
              {row.map((item) => (
                <article
                  className={`flex min-h-[198px] flex-col justify-between gap-6 overflow-hidden border border-white/10 bg-white/[0.08] p-6 ${
                    item.tint ? TINTS[item.tint] : ''
                  }`}
                  key={item.name}
                >
                  <div>
                    <h3 className="font-serif text-[clamp(1.5rem,2.2vw,2rem)] leading-none font-bold text-cream">
                      {item.name}
                    </h3>
                    <p className="mt-3 text-[14px] leading-none font-medium text-cream/80">
                      {item.tagline}
                    </p>
                  </div>

                  <p className="max-w-[60ch] text-[17px] leading-[1.45] text-cream">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
