import React from 'react'

import { SectionTag } from '@/components/SectionTag'

import type { ValuesProps } from './types'

/**
 * "Nos valeurs" on /a-propos: a cream heading over a full-bleed ink band of
 * numbered values.
 *
 * Server component.
 *
 * The band runs edge to edge while its contents sit on the same 1324px measure
 * as the rest of the page, so it is a sibling of the padded heading rather than
 * a child of it. The rules between columns are 71px tall and centred in the
 * 80px gutter, which is why they are pseudo-elements offset into the gap rather
 * than borders on the column itself.
 */
export const Values: React.FC<ValuesProps> = ({ badge, titleLines, items }) => {
  if (items.length === 0) return null

  return (
    <section className="bg-cream pt-[clamp(56px,7vw,96px)] text-navy">
      <div className="px-gutter">
        <div className="mx-auto max-w-[1353px]">
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
        </div>
      </div>

      <div className="mt-[clamp(28px,3.3vw,47px)] bg-ink px-gutter py-10">
        <ul className="mx-auto grid max-w-[1324px] list-none grid-cols-4 gap-x-20 p-0 max-nav:grid-cols-2 max-nav:gap-y-10 max-[560px]:grid-cols-1">
          {items.map((item, index) => (
            <li
              className="relative before:absolute before:top-1/2 before:-left-10 before:h-[71px] before:w-px before:-translate-y-1/2 before:bg-cream/85 first:before:hidden max-nav:before:hidden"
              key={item.name}
            >
              <p className="text-[1.5rem] leading-none font-medium text-cream/50 tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </p>

              <h3 className="mt-[21px] font-serif text-[1.5rem] leading-none font-bold text-cream">
                {item.name}
              </h3>

              <p className="mt-3.5 text-[0.875rem] leading-[1.43] text-cream/55">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
