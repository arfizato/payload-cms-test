import React from 'react'

import { PhotoCarousel } from './PhotoCarousel'
import type { MetiersProps } from './types'

const ArrowUpRight: React.FC = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    aria-hidden="true"
    className="flex-none translate-y-[2px]"
  >
    <path
      d="M11 21L21 11M21 11h-8M21 11v8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * "Nos métiers" in full — one row per service, sides alternating.
 *
 * Server component. Only the photo carousel in each row hydrates, so the copy,
 * the numbering and every image are static HTML.
 *
 * The number is derived from position rather than stored, so it always matches
 * what the reader sees. Reordering the collection renumbers the page; nobody has
 * to remember to renumber anything by hand.
 */
export const Metiers: React.FC<MetiersProps> = ({ items }) => {
  if (items.length === 0) return null

  return (
    <section
      id="metiers"
      className="bg-cream px-gutter py-[clamp(56px,7vw,96px)] text-ink"
      aria-label="Nos métiers"
    >
      <div className="flex flex-col gap-[clamp(64px,9vw,128px)]">
        {items.map((metier, i) => {
          // Rows 1, 3, 5 put the copy first; the rest lead with the photo. On
          // narrow screens the grid collapses and the copy always comes first,
          // which is why the order utilities are lg-only.
          const copyFirst = i % 2 === 0

          const heading = (
            <span className="flex items-center gap-2 text-accent">
              <span className="font-serif text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] font-semibold tracking-[-0.01em]">
                {metier.title}
              </span>
              <ArrowUpRight />
            </span>
          )

          return (
            <article
              // The template swaps with the row, not just the children. `order`
              // alone moves the photo into the other column but leaves the column
              // widths where they were, which made every second photo 39/61 the
              // size of its neighbours. The photo column is always the wide one.
              // The homepage links straight to this row. The navbar is not
              // fixed, so the margin is only breathing room above the number.
              id={metier.anchor}
              className={`grid scroll-mt-8 items-start gap-[clamp(24px,3vw,40px)] ${
                copyFirst
                  ? 'lg:grid-cols-[minmax(0,39fr)_minmax(0,61fr)]'
                  : 'lg:grid-cols-[minmax(0,61fr)_minmax(0,39fr)]'
              }`}
              key={metier.title}
            >
              <div className={copyFirst ? 'lg:order-1' : 'lg:order-2'}>
                <div className="relative pb-5">
                  <span className="block text-[12px] leading-[14px] font-medium tracking-[0.24em] text-accent/60 uppercase">
                    {String(i + 1).padStart(2, '0')}/
                  </span>

                  <h2 className="mt-3 pl-8">
                    {metier.href ? (
                      <a
                        className="inline-flex transition-opacity hover:opacity-70"
                        href={metier.href}
                      >
                        {heading}
                      </a>
                    ) : (
                      heading
                    )}
                  </h2>

                  {/* The design's rule under each title: navy at 20%. */}
                  <span aria-hidden="true" className="mt-5 block h-px w-full bg-navy/20" />
                </div>

                {metier.description && (
                  <p className="px-8 text-[clamp(1rem,1.5vw,1.5rem)] leading-[1.21] font-medium text-navy">
                    {metier.description}
                  </p>
                )}
              </div>

              <div className={copyFirst ? 'lg:order-2' : 'lg:order-1'}>
                {/* Only the first row is above the fold on this page. */}
                <PhotoCarousel photos={metier.photos} priority={i === 0} />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
