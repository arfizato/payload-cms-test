import Image from 'next/image'
import React from 'react'

import type { ClientLogosProps } from './types'

/**
 * How many times the logo set is repeated to build one loop segment.
 * The segment must be wider than the viewport or a gap appears mid-scroll,
 * which is why a handful of logos still needs repeating.
 */
const REPEAT = 3

/**
 * Logos are uploaded in their brand colours. On the dark band `brightness-0`
 * flattens each one to black and `invert` turns that to white, so every brand
 * reads as one knocked-out set without anyone preparing white versions.
 */
const TONES = {
  light: { band: 'bg-cream', logo: 'opacity-70 grayscale' },
  dark: { band: 'bg-ink', logo: 'opacity-80 brightness-0 invert' },
} as const

export const ClientLogos: React.FC<ClientLogosProps> = ({
  items,
  speedSeconds = 60,
  tone = 'light',
}) => {
  if (items.length === 0) return null

  // One segment, then the same segment again. The animation translates exactly
  // -50%, so the second copy lands where the first began — no visible seam.
  const segment = Array.from({ length: REPEAT }, () => items).flat()
  const track = [...segment, ...segment]

  return (
    <section
      className={`marquee-mask overflow-hidden py-[46px] ${TONES[tone].band}`}
      aria-label="Ils nous font confiance"
    >
      <div
        className="marquee-track flex w-max items-center"
        style={{ ['--marquee-duration' as string]: `${speedSeconds}s` }}
      >
        {track.map((logo, i) => {
          // The duplicates are decorative repeats of the same brands.
          const duplicate = i >= items.length

          const image = (
            <Image
              // 48px, the design's logo row height. Feedback asked for bigger
              // logos on every page; this was 44.
              className={`marquee-item h-12 w-auto ${TONES[tone].logo}`}
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
            />
          )

          // A repeat must not be focusable, or tabbing walks the same brands
          // several times over.
          return logo.href && !duplicate ? (
            <a
              key={`${logo.src}-${i}`}
              href={logo.href}
              target="_blank"
              rel="noreferrer noopener"
              className="contents"
            >
              {image}
            </a>
          ) : (
            <span key={`${logo.src}-${i}`} className="contents" aria-hidden={duplicate}>
              {image}
            </span>
          )
        })}
      </div>
    </section>
  )
}
