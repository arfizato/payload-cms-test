'use client'

import React, { useEffect, useRef, useState } from 'react'

import { CarouselArrow } from '@/components/CarouselArrow'

import { TestimonialCard } from './Card'
import type { Testimonial } from './types'

/** Cards in view per breakpoint — three on the design's desktop frame. */
const PER_VIEW = [
  { query: '(min-width: 1024px)', count: 3 },
  { query: '(min-width: 768px)', count: 2 },
] as const

const usePerView = (): number => {
  // One card until the first effect runs, matching the server render, so
  // hydration never disagrees about how many cards are in view.
  const [perView, setPerView] = useState(1)

  useEffect(() => {
    const lists = PER_VIEW.map(({ query, count }) => ({ list: window.matchMedia(query), count }))
    const update = () => setPerView(lists.find(({ list }) => list.matches)?.count ?? 1)

    update()
    lists.forEach(({ list }) => list.addEventListener('change', update))
    return () => lists.forEach(({ list }) => list.removeEventListener('change', update))
  }, [])

  return perView
}

/**
 * Three testimonials in view, stepping one at a time with the side arrows or a
 * swipe. Feedback asked for exactly this: feature three, let the reader swipe
 * for more.
 *
 * Same track technique as the projects carousel: every card is in the DOM and
 * the track is translated by whole slide widths, the width living in a CSS
 * variable so the breakpoints need no measuring. No autoplay — these are read,
 * not glanced at.
 */
export const Carousel: React.FC<{ items: Testimonial[] }> = ({ items }) => {
  const perView = usePerView()
  const [index, setIndex] = useState(0)
  const touchStart = useRef<number | null>(null)

  const lastIndex = Math.max(0, items.length - perView)
  const current = Math.min(index, lastIndex)

  // Wraps at both ends, so neither arrow is ever a dead click.
  const step = (delta: 1 | -1) =>
    setIndex(() => {
      const next = current + delta
      if (next < 0) return lastIndex
      if (next > lastIndex) return 0
      return next
    })

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStart.current === null) return
    const dx = event.changedTouches[0].clientX - touchStart.current
    touchStart.current = null
    // A short drag is a tap or a scroll that wandered; only a deliberate
    // horizontal swipe moves the track.
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1)
  }

  return (
    <div className="relative">
      {lastIndex > 0 && (
        <>
          <CarouselArrow
            direction="previous"
            label="Témoignage précédent"
            onClick={() => step(-1)}
            className="absolute top-1/2 -left-[22px] z-10 -translate-y-1/2 max-md:hidden"
          />
          <CarouselArrow
            direction="next"
            label="Témoignage suivant"
            onClick={() => step(1)}
            className="absolute top-1/2 -right-[22px] z-10 -translate-y-1/2 max-md:hidden"
          />
        </>
      )}

      {/* The negative margin swallows the last card's trailing gutter, so the
          right edge of the row lines up with the heading's measure. */}
      <div
        className="-mr-4 overflow-hidden"
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX
        }}
        onTouchEnd={onTouchEnd}
      >
        <ul
          className="m-0 flex list-none p-0 [--slide:100%] transition-transform duration-500 ease-out md:[--slide:50%] lg:[--slide:calc(100%/3)]"
          style={{
            transform: 'translateX(calc(var(--i) * -1 * var(--slide)))',
            ['--i' as string]: current,
          }}
        >
          {items.map((item, i) => (
            <li
              className="w-[var(--slide)] shrink-0 pr-4"
              key={`${item.author}-${i}`}
              // Cards out of view stay out of the tab order and the reading order.
              aria-hidden={i < current || i >= current + perView}
            >
              <TestimonialCard item={item} />
            </li>
          ))}
        </ul>
      </div>

      {lastIndex > 0 && (
        <div className="mt-8 flex justify-center gap-[10px] md:hidden">
          {Array.from({ length: lastIndex + 1 }, (_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Témoignage ${i + 1}`}
              aria-current={i === current}
              className={`size-1.5 rounded-full bg-accent transition-opacity duration-300 ${
                i === current ? 'opacity-100' : 'opacity-40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
