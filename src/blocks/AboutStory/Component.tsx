import Image from 'next/image'
import React from 'react'

import { SectionTag } from '@/components/SectionTag'

import type { AboutStoryProps } from './types'

/**
 * "Notre histoire" — the two-column story block on /a-propos.
 *
 * Server component; nothing here is interactive.
 *
 * Sizes come straight from the design: a 675/626 column split with a 48px gap,
 * a 32px accent heading over a hairline rule, and 24px body copy. The type uses
 * `clamp()` so it resolves to the design's exact values at 1440 and scales down
 * below, as the other sections do.
 */
export const AboutStory: React.FC<AboutStoryProps> = ({
  badge,
  titleLines,
  paragraphs,
  image,
}) => {
  if (titleLines.length === 0 && paragraphs.length === 0) return null

  return (
    <section className="bg-cream px-gutter py-[clamp(56px,7vw,96px)] text-navy">
      <div className="mx-auto grid max-w-[1349px] grid-cols-[675fr_626fr] items-start gap-12 max-nav:grid-cols-1 max-nav:gap-8">
        <div>
          {/* The rule spans the whole column; the copy inside it is inset 32px. */}
          <div className="border-b border-navy/20 py-7 max-nav:pt-0">
            <div className="px-8 max-nav:px-0">
              {badge && (
                <p className="mb-2">
                  <SectionTag tone="light">{badge}</SectionTag>
                </p>
              )}

              {titleLines.length > 0 && (
                <h2 className="max-w-[477px] font-serif text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.1] tracking-[-0.01em] text-accent">
                  {titleLines.map((line) => (
                    <span className="block" key={line}>
                      {line}
                    </span>
                  ))}
                </h2>
              )}
            </div>
          </div>

          {/* No gap between paragraphs — the design runs them as one block. */}
          <div className="px-8 pt-5 text-[clamp(1rem,1.7vw,1.5rem)] leading-[1.21] font-medium max-nav:px-0">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="relative aspect-[626/737] overflow-hidden rounded-[4px]">
          <Image
            className="object-cover"
            style={{ objectPosition: image.focalPoint ?? 'center' }}
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 900px) 100vw, 626px"
            quality={82}
          />
          {/* The design darkens the photo by 20%, as the métiers carousel does. */}
          <div aria-hidden="true" className="absolute inset-0 bg-black/20" />
        </div>
      </div>
    </section>
  )
}
