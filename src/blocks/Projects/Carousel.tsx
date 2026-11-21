'use client'

import React, { useEffect, useState } from 'react'

import { CarouselArrow } from '@/components/CarouselArrow'

import { ProjectCard } from './Card'
import type { ProjectCardData } from './types'

const AUTOPLAY_MS = 5000

/**
 * Two cards visible, sliding one at a time.
 *
 * Not paged two-at-a-time: with an odd number of projects the last page would
 * be half empty. Stepping by one means every project gets a turn on the left,
 * and the dot count follows the project count rather than the page count.
 *
 * The track holds every card and is translated by whole slide widths. Slide
 * width lives in a CSS variable so the same arithmetic works at both
 * breakpoints — one card on mobile, two from `md` up — without measuring
 * anything in JavaScript.
 */
export const Carousel: React.FC<{ items: ProjectCardData[] }> = ({ items }) => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // Clamped to whatever the current viewport shows; the desktop case (2) is the
  // constraining one, and on mobile the last slide simply sits flush.
  const lastIndex = Math.max(0, items.length - 2)
  const current = Math.min(index, lastIndex)

  useEffect(() => {
    if (lastIndex === 0 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => setIndex((i) => (i >= lastIndex ? 0 : i + 1)), AUTOPLAY_MS)

    return () => clearInterval(id)
  }, [lastIndex, paused])

  // The side arrows wrap, like autoplay does, so neither end is a dead click.
  const step = (delta: 1 | -1) =>
    setIndex(() => {
      const next = current + delta
      if (next < 0) return lastIndex
      if (next > lastIndex) return 0
      return next
    })

  // Pause on hover only. Pausing on focus as well looked identical but broke it:
  // clicking a dot focuses that button, focus then stays there, and autoplay
  // never resumed.
  return (
    <div
      className="@container relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/*
        Side arrows, from the design: they overhang the outer cards by half
        their width and sit level with the middle of the photo, not the card.
        From `md` a slide is half the track less ~44px of gutter, and the photo
        is 4:3, so its middle is (50cqw − 44px) × 3/8 ≈ 18.75cqw − 16px down.
        Hidden below `md`, where one card shows and the dots do the job.
      */}
      {lastIndex > 0 && (
        <>
          <CarouselArrow
            direction="previous"
            label="Réalisation précédente"
            onClick={() => step(-1)}
            className="absolute top-[calc(18.75cqw-16px)] -left-[22px] z-10 -translate-y-1/2 max-md:hidden"
          />
          <CarouselArrow
            direction="next"
            label="Réalisation suivante"
            onClick={() => step(1)}
            // Each slide carries its gutter on the right, so the last card
            // stops that far short of the track; centre on its edge, not ours.
            className="absolute top-[calc(18.75cqw-16px)] right-[calc(clamp(24px,3vw,44px)-22px)] z-10 -translate-y-1/2 max-md:hidden"
          />
        </>
      )}

      <div className="overflow-hidden">
        <div
          className="flex [--slide:100%] transition-transform duration-500 ease-out md:[--slide:50%]"
          style={{
            transform: 'translateX(calc(var(--i) * -1 * var(--slide)))',
            ['--i' as string]: current,
          }}
        >
          {items.map((project) => (
            <div
              className="w-[var(--slide)] shrink-0 pr-0 md:pr-[clamp(24px,3vw,44px)]"
              key={project.href + project.title}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {lastIndex > 0 && (
        <div className="mt-10 flex justify-center gap-[10px]">
          {Array.from({ length: lastIndex + 1 }, (_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Réalisation ${i + 1}`}
              aria-current={i === current}
              className={`size-1.5 rounded-full bg-accent transition-opacity duration-300 ${
                i === current ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
