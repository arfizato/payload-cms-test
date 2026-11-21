import Image from 'next/image'
import React from 'react'

import type { ProjectCardData } from './types'

const Corner: React.FC<{ size: number }> = ({ size }) => (
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
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * Same card, two looks — a variant rather than a second component, per
 * docs/content-architecture.md ("one section, several looks → variant").
 *
 * The index page is a wall of cards, so the design dials the link down to the
 * muted grey. The carousel sits under a heading with only two cards showing,
 * and keeps the red.
 */
const VARIANTS = {
  carousel: {
    link: 'text-[12px] tracking-[0.14em] text-accent',
    label: 'Lire',
    icon: 14,
  },
  index: {
    link: 'text-[14px] text-muted',
    label: 'Voire le projet',
    icon: 16,
  },
} as const

export type ProjectCardVariant = keyof typeof VARIANTS

/**
 * One project card. Shared by the homepage carousel and the /projets grid so the
 * two cannot drift — the carousel had its own copy until the index page needed
 * the same markup.
 *
 * Server component: nothing here is interactive. `variant` is a plain string so
 * it still crosses the boundary when the client-side carousel renders this.
 */
export const ProjectCard: React.FC<{
  project: ProjectCardData
  sizes?: string
  variant?: ProjectCardVariant
}> = ({ project, sizes = '(max-width: 768px) 100vw, 46vw', variant = 'carousel' }) => (
  <article className="flex flex-col">
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/5">
      <Image
        className="object-cover"
        src={project.image.src}
        alt={project.image.alt}
        fill
        sizes={sizes}
        quality={82}
      />
    </div>

    {/*
      The meta row: sector on the left, the métier tags on the right.

      The tags used to sit under the summary as padded pills; the client read
      those as buttons. They are now hashtags — a tight 10% wash, no rounding,
      no padding to speak of — so they read as labels, which is what they are.
    */}
    {(project.sector || project.city || project.tags.length > 0) && (
      <div className="mt-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        {(project.sector || project.city) && (
          <p className="flex items-center gap-2 text-[13px] font-medium text-accent">
            <span aria-hidden="true" className="inline-block size-2.5 bg-accent" />
            {[project.sector, project.city].filter(Boolean).join('. ')}.
          </p>
        )}

        {project.tags.length > 0 && (
          <ul className="ml-auto flex max-w-[60%] flex-wrap justify-end gap-x-2 gap-y-1.5 max-sm:ml-0 max-sm:max-w-none max-sm:justify-start">
            {project.tags.map((tag) => (
              <li
                className="bg-accent/10 p-0.5 text-[12px] leading-[12px] font-semibold text-accent"
                key={tag}
              >
                #{tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    )}

    <h3 className="mt-1 font-sans text-[clamp(1.25rem,1.7vw,1.55rem)] leading-tight font-bold tracking-[-0.01em]">
      {project.title}
    </h3>

    {project.summary && (
      <p className="mt-1 max-w-[52ch] text-[15px] leading-[1.5] text-ink/80">{project.summary}</p>
    )}

    <a
      className={`mt-4 inline-flex items-center gap-2 font-medium uppercase transition-opacity hover:opacity-70 ${VARIANTS[variant].link}`}
      href={project.href}
    >
      <Corner size={VARIANTS[variant].icon} />
      {VARIANTS[variant].label}
    </a>
  </article>
)
