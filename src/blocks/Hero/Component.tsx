import Image from 'next/image'
import React from 'react'

import { SectionTag } from '@/components/SectionTag'

import type { HeroProps } from './types'

export const Hero: React.FC<HeroProps> = ({ badge, title, lede, cta, image }) => {
  return (
    <section className="relative isolate flex min-h-svh items-center overflow-hidden px-gutter pt-[120px] pb-[clamp(72px,12vh,132px)] text-white">
      <Image
        className="-z-20 object-cover"
        style={{ objectPosition: image.focalPoint ?? 'center 62%' }}
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        quality={82}
      />
      {/* Two overlays: one for the copy on the left, one so the nav stays legible. */}
      <div className="hero-scrim absolute inset-0 -z-10" aria-hidden="true" />

      <div className="w-full max-w-[940px]">
        {badge && (
          <p className="mb-[30px]">
            <SectionTag>{badge}</SectionTag>
          </p>
        )}

        <h1 className="mb-[26px] max-w-[14ch] text-[clamp(2.6rem,6.2vw,5.1rem)] leading-[1.03] font-bold max-nav:max-w-[18ch]">
          {title}
        </h1>

        {lede && (
          <p className="mb-8 max-w-[54ch] text-[15px] leading-[1.62] text-white/75">{lede}</p>
        )}

        {cta && (
          <a
            className="inline-flex items-center gap-3 rounded-lg bg-paper px-6 py-[14px] text-[0.9rem] font-medium text-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgba(0,0,0,0.9)]"
            href={cta.href}
          >
            {cta.label}
            <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
              <path
                d="M6.5 1.5v10M6.5 11.5L2.5 7.5M6.5 11.5l4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>
    </section>
  )
}
