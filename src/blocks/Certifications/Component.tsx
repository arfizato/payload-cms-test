import React from 'react'

import { SectionTag } from '@/components/SectionTag'

import type { CertificationsProps } from './types'

/**
 * "Exclusivités européennes" on /a-propos: the distributed brands, two cards to
 * a row on cream.
 *
 * Server component.
 *
 * As in the entities band above, the rows are lopsided — but here they mirror,
 * narrow/wide then wide/narrow, so the pair reads as a woven block rather than
 * a grid. Rows past the second repeat the pattern, which matters because an
 * editor can add a fifth brand.
 */
const ROW_TEMPLATES = ['grid-cols-[579fr_759fr]', 'grid-cols-[782fr_555fr]']

/**
 * The accent blocks scattered over the cards, measured off the design: one set
 * per position in the four-card cycle. `left`/`top` are percentages of the card
 * so they hold as the column widths change; the sizes are fixed because the
 * motif is a constant module, not a proportion. Anything running past an edge
 * is clipped by the card's `overflow-hidden`, which is how the design crops
 * them too.
 */
const DECOR: { left: string; top: string; w: number; h: number; tint: 10 | 20 }[][] = [
  [
    { left: '85%', top: '0%', w: 39, h: 19, tint: 20 },
    // A step: one module, then a bar twice as wide beneath it.
    { left: '2.6%', top: '65.5%', w: 28, h: 28, tint: 10 },
    { left: '2.6%', top: '75.2%', w: 57, h: 28, tint: 10 },
  ],
  [
    // An L: a full-width bar with only its right half carried down, so the
    // bottom-left quarter stays empty.
    { left: '85%', top: '4.2%', w: 102, h: 51, tint: 10 },
    { left: '91.7%', top: '21.7%', w: 51, h: 51, tint: 10 },
  ],
  [
    { left: '0%', top: '58.6%', w: 21, h: 39, tint: 20 },
    // The mirror of card one's step: the module sits right, the bar below it
    // reaches back to the left.
    { left: '92.7%', top: '53.9%', w: 32, h: 33, tint: 10 },
    { left: '88.7%', top: '65.3%', w: 64, h: 31, tint: 10 },
  ],
  [
    { left: '92.8%', top: '52%', w: 40, h: 39, tint: 20 },
    { left: '7.2%', top: '71.7%', w: 41, h: 22, tint: 10 },
  ],
]

export const Certifications: React.FC<CertificationsProps> = ({
  badge,
  titleLines,
  lede,
  items,
}) => {
  if (items.length === 0) return null

  const rows = Array.from({ length: Math.ceil(items.length / 2) }, (_, i) =>
    items.slice(i * 2, i * 2 + 2),
  )

  return (
    <section className="bg-cream px-gutter py-[clamp(56px,7vw,96px)] text-navy">
      <div className="mx-auto max-w-[1354px]">
        {badge && (
          <p className="mb-7">
            <SectionTag tone="light">{badge}</SectionTag>
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
          <p className="mt-[clamp(16px,1.7vw,24px)] max-w-[80ch] text-[15px] leading-[1.35] font-semibold">
            {lede}
          </p>
        )}

        <div className="mt-[clamp(28px,3.3vw,48px)] grid gap-[18px]">
          {rows.map((row, rowIndex) => (
            <div
              className={`grid gap-4 max-nav:grid-cols-1 ${
                ROW_TEMPLATES[rowIndex % ROW_TEMPLATES.length]
              }`}
              key={row.map((item) => item.brand).join('|')}
            >
              {row.map((item, columnIndex) => (
                <article
                  // Square at the top, rounded at the foot: the radius is on
                  // the card rather than the strip so `overflow-hidden` clips
                  // the strip and the decoration to the same corner.
                  className="relative flex min-h-[290px] flex-col overflow-hidden rounded-b-[10px] bg-paper"
                  key={item.brand}
                >
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    {DECOR[(rowIndex * 2 + columnIndex) % DECOR.length].map((block, i) => (
                      <span
                        className={`absolute ${block.tint === 20 ? 'bg-accent/20' : 'bg-accent/10'}`}
                        key={i}
                        style={{
                          left: block.left,
                          top: block.top,
                          width: block.w,
                          height: block.h,
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative flex-1 p-5">
                    <p className="mb-4">
                      <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[12px] leading-[18px] font-medium text-accent">
                        {item.brand}
                      </span>
                    </p>

                    <h3 className="font-serif text-[1.25rem] leading-[1.3] font-bold text-ink">
                      {item.heading}
                    </h3>

                    <p className="mt-3 text-[0.875rem] leading-[1.43] text-navy/75">{item.body}</p>
                  </div>

                  {item.certification && (
                    <p className="lattice relative mt-auto flex items-center gap-2 bg-navy px-5 py-4 text-[0.875rem] text-cream">
                      <svg
                        aria-hidden="true"
                        className="flex-none"
                        fill="none"
                        height="12"
                        viewBox="0 0 14 12"
                        width="14"
                      >
                        <path
                          d="M1 6.2 5 10 13 1.5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.6"
                        />
                      </svg>
                      {item.certification}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
