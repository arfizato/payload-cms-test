import Image from 'next/image'
import React from 'react'

import { SectionTag } from '@/components/SectionTag'

import type { NewsProps } from './types'

const Corner: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="flex-none -scale-x-100"
  >
    <path
      d="M4 4v5a4 4 0 004 4h12M15 9l5 4-5 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Dark pill with a small square marker, used for each card's meta line. The
    section badge above uses the shared SectionTag instead. */
const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/6 px-3 py-1.5 text-[12px] font-medium text-white/85 backdrop-blur-sm">
    <span aria-hidden="true" className="inline-block size-2.5 bg-white/80" />
    {children}
  </span>
)

/**
 * "Actualités" — three article cards on a dark ground.
 *
 * Server component; nothing here is interactive.
 */
export const News: React.FC<NewsProps> = ({ badge, headingLines, cta, items }) => {
  if (items.length === 0) return null

  return (
    <section
      id="actualites"
      className="lattice relative overflow-hidden bg-ink px-gutter py-[clamp(56px,7vw,96px)] text-white"
    >
      <div className="relative">
        {badge && (
          <p className="mb-7">
            <SectionTag>{badge}</SectionTag>
          </p>
        )}

        <div className="mb-[clamp(28px,4vw,44px)] flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-[clamp(1.9rem,3.4vw,3.2rem)] leading-[1.1] font-bold">
            {headingLines.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </h2>

          {cta && (
            <a
              className="inline-flex items-center gap-2 rounded-md bg-cream px-5 py-3 text-[13px] font-semibold text-ink transition hover:-translate-y-0.5"
              href={cta.href}
            >
              {cta.label}
              <svg width="12" height="12" viewBox="0 0 11 11" aria-hidden="true">
                <path
                  d="M1.5 9.5L9.5 1.5M9.5 1.5H3.5M9.5 1.5V7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </div>

        <div className="grid gap-[clamp(20px,2.4vw,34px)] md:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <article className="flex flex-col" key={article.title}>
              <div className="relative aspect-[294/172] w-full overflow-hidden bg-white/5">
                <Image
                  className="object-cover"
                  src={article.image.src}
                  alt={article.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 31vw"
                  quality={82}
                />
              </div>

              {(article.category || article.date) && (
                <p className="mt-4">
                  <Pill>{[article.category, article.date].filter(Boolean).join('. ')}.</Pill>
                </p>
              )}

              <h3 className="mt-3 font-sans text-[clamp(1rem,1.25vw,1.15rem)] leading-[1.35] font-semibold">
                {article.title}
              </h3>

              <a
                className="mt-3 inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.14em] text-white/60 uppercase transition-colors hover:text-white"
                href={article.href}
              >
                <Corner />
                Lire
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
