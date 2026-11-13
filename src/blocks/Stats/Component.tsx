import React from 'react'

import { Counter } from './Counter'
import type { StatsProps } from './types'

/**
 * Server component. Only the number inside each stat is client-side — see
 * Counter.tsx — so the band, layout and labels ship as static HTML.
 *
 * The band is ink, not accent. The red version predated the current design;
 * every frame that carries this band — the homepage strip and the À propos
 * page — now shows it on `--color-ink` (#171817), sampled straight from the
 * Figma fill. Changed here rather than per page so the two cannot drift.
 */
export const Stats: React.FC<StatsProps> = ({ items }) => {
  if (items.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-ink px-gutter py-[clamp(48px,6vw,84px)] text-cream">
      {/* Faint offset squares, as in the design. Decorative only. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="absolute top-3 left-[8%] size-20 bg-white" />
        <div className="absolute -top-6 left-[26%] size-28 bg-white" />
        <div className="absolute bottom-2 left-[41%] size-16 bg-white" />
        <div className="absolute -bottom-8 left-[58%] size-24 bg-white" />
        <div className="absolute top-1 left-[76%] size-20 bg-white" />
        <div className="absolute -top-4 left-[91%] size-24 bg-white" />
      </div>

      <dl className="relative mx-auto flex max-w-[1240px] flex-wrap items-start justify-between gap-y-8">
        {items.map((stat) => (
          <div className="flex min-w-[128px] flex-1 flex-col items-center gap-1" key={stat.label}>
            <dt className="font-serif text-[clamp(1.75rem,2.6vw,2.4rem)] leading-none font-bold tabular-nums">
              <Counter
                value={stat.value}
                decimals={stat.decimals}
                prefix={stat.prefix ?? undefined}
                suffix={stat.suffix ?? undefined}
              />
            </dt>
            <dd className="m-0 text-center text-[13px] leading-tight text-cream/80">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
