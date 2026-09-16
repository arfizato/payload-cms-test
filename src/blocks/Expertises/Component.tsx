'use client'

import Image from 'next/image'
import React, { useState } from 'react'

import { SectionTag } from '@/components/SectionTag'

import type { ExpertisesProps } from './types'

/*
 * Sizes below are taken from the Figma spec, expressed as clamps anchored to a
 * 1440px frame — at that width they resolve to the spec values exactly
 * (title 32px, description 24px, row 119px) and scale either side of it.
 */

const Arrow: React.FC<{ up: boolean }> = ({ up }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={`flex-none transition-transform duration-300 ${up ? '' : 'rotate-180'}`}
  >
    <path
      d="M12 19V5M12 5l-6 6M12 5l6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Corner: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="flex-none -scale-x-100"
  >
    <path
      d="M4 4v5a4 4 0 004 4h12M15 9l5 4-5 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const Expertises: React.FC<ExpertisesProps> = ({ badge, headingLines, items }) => {
  const [active, setActive] = useState(0)

  if (items.length === 0) return null

  const current = items[active] ?? items[0]

  return (
    <section id="expertises" className="bg-cream px-gutter py-[clamp(56px,7vw,96px)] text-ink">
      {badge && (
        <p className="mb-7">
          <SectionTag tone="light">{badge}</SectionTag>
        </p>
      )}

      <h2 className="mb-[clamp(32px,4vw,64px)] text-[clamp(1.9rem,3.4vw,3.2rem)] leading-[1.1] font-bold">
        {headingLines.map((line) => (
          <span className="block" key={line}>
            {line}
          </span>
        ))}
      </h2>

      {/* 618 : 669 columns with a 66px gap, per the spec. */}
      <div className="grid items-stretch gap-[clamp(28px,4.6vw,66px)] lg:grid-cols-[618fr_669fr]">
        {/* Accordion — the list drives which photograph is shown. */}
        <div className="flex flex-col gap-5">
          {items.map((item, i) => {
            const open = i === active

            return (
              <div key={item.title}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`expertise-panel-${i}`}
                    onClick={() => setActive(i)}
                    className={`flex w-full items-center justify-between gap-4 border-b border-ink/20 py-[clamp(16px,2.2vw,32px)] pl-[clamp(16px,2.2vw,32px)] text-left transition-colors ${
                      open ? 'text-accent' : 'text-ink hover:text-accent/70'
                    }`}
                  >
                    <span>
                      <span className="mb-2 block font-sans text-[12px] leading-[14px] font-medium tracking-[0.24px] uppercase opacity-60">
                        {String(i + 1).padStart(2, '0')}/
                      </span>
                      <span className="block font-serif text-[24px] leading-[1.1] font-semibold tracking-[-0.32px] lg:text-[32px] lg:leading-[35.2px]">
                        {item.title}
                      </span>
                    </span>
                    <Arrow up={open} />
                  </button>
                </h3>

                {/* Grid-rows trick: animates open/closed without a fixed height. */}
                <div
                  id={`expertise-panel-${i}`}
                  className={`grid transition-all duration-300 ease-out ${
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-4 px-[clamp(16px,2.2vw,32px)] pt-5">
                      {item.description && (
                        <p className="max-w-[618px] text-[18px] leading-[1.21] font-medium tracking-normal text-ink lg:text-[24px]">
                          {item.description}
                        </p>
                      )}
                      {item.link && (
                        <a
                          className="inline-flex items-center gap-2 text-[15px] font-medium text-muted uppercase transition-colors hover:text-accent lg:text-[20px]"
                          href={item.link.href}
                          tabIndex={open ? undefined : -1}
                        >
                          <Corner />
                          {item.link.label}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Carousel — driven entirely by the accordion selection. */}
        {/* items-center leaves the card's width auto, so aspect-ratio derives it
            from the height flex-1 hands down — the card ends level with the last
            accordion row and stays portrait at any viewport width. */}
        <div className="flex h-full flex-col items-center gap-4">
          <div className="relative aspect-[669/764] max-w-full min-h-0 flex-1 overflow-hidden rounded-[4px] bg-ink/5">
            <Image
              // Keyed so React swaps the node and the fade replays per selection.
              key={current.image.src + active}
              className="animate-[fade_400ms_ease-out] object-cover"
              src={current.image.src}
              alt={current.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 47vw"
              quality={82}
            />

            <div className="absolute inset-x-0 bottom-[clamp(16px,2.4vw,34px)] flex flex-wrap items-center justify-between gap-4 px-[clamp(16px,2.4vw,27px)]">
              {current.image.caption && (
                <p className="text-[18px] leading-[1.21] font-bold text-[#e5e5e5] lg:text-[24px]">
                  {current.image.caption}
                </p>
              )}
              {current.link && (
                <a
                  className="ml-auto inline-flex h-11 items-center justify-center gap-2 rounded-md bg-cream px-5 text-[14px] font-semibold text-ink transition hover:-translate-y-0.5 lg:text-[16px]"
                  href={current.link.href}
                >
                  <Corner />
                  {current.link.label}
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-[10px]">
            {items.map((item, i) => (
              <button
                type="button"
                key={item.title}
                onClick={() => setActive(i)}
                aria-label={item.title}
                aria-current={i === active}
                className={`size-1.5 rounded-full bg-accent transition-opacity duration-300 ${
                  i === active ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
