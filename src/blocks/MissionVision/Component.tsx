import React from 'react'

import { SectionTag } from '@/components/SectionTag'

import type { MissionVisionProps } from './types'

/**
 * "Mission & Vision" on /a-propos: two outlined cards under a section heading.
 *
 * Server component.
 *
 * The two cards differ only in weight — the left one carries a 5% accent wash
 * and a solid border so it reads first. Sizes are measured off the design: 668px
 * cards with a 16px gutter, a 64px heading, and a 58px square tucked into each
 * bottom-right corner.
 */
export const MissionVision: React.FC<MissionVisionProps> = ({ badge, titleLines, cards }) => {
  if (cards.length === 0) return null

  return (
    <section className="bg-cream px-gutter py-[clamp(56px,7vw,96px)] text-navy">
      <div className="mx-auto max-w-[1353px]">
        {badge && (
          <p className="mb-7">
            <SectionTag tone="light">{badge}</SectionTag>
          </p>
        )}

        {titleLines.length > 0 && (
          <h2 className="mb-[clamp(28px,3.3vw,47px)] text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.2] font-bold">
            {titleLines.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </h2>
        )}

        <div className="grid grid-cols-2 gap-4 max-nav:grid-cols-1">
          {cards.map((card) => (
            <article
              // The bottom padding reserves the corner square's band (58px plus
              // its 17px inset), so the copy can never collide with it however
              // it reflows. The square is dropped before that matters on mobile.
              className={`relative overflow-hidden border px-6 pt-9 pb-[92px] max-nav:pb-9 ${
                card.variant === 'primary'
                  ? 'border-accent bg-accent/5'
                  : 'border-accent/50 bg-cream'
              }`}
              key={card.heading}
            >
              <h3 className="font-serif text-[clamp(1.75rem,3.1vw,2.8rem)] leading-[1.1] font-bold text-accent">
                {card.heading}
              </h3>

              <p className="mt-7 max-w-[54ch] text-[clamp(1rem,1.7vw,1.5rem)] leading-[1.21] font-medium">
                {card.body}
              </p>

              {/* Decorative, and it must not sit under the copy on a narrow card. */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute right-[18px] bottom-[17px] size-[58px] max-nav:hidden ${
                  card.variant === 'primary' ? 'bg-cream' : 'bg-accent/20'
                }`}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
