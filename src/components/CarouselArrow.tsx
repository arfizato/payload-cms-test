import React from 'react'

/**
 * The square glass arrow the design puts on either side of a carousel — the
 * homepage projects and the testimonials. 44px, ink at 70% over a blur, 8px
 * radius, a 14px arrow in the light grey the design uses for icons on ink.
 *
 * Positioning is the caller's: it renders a plain button so the same control
 * can sit over a track, beside it, or in a row under it.
 */
export const CarouselArrow: React.FC<{
  direction: 'previous' | 'next'
  onClick: () => void
  label: string
  className?: string
}> = ({ direction, onClick, label, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`inline-flex size-11 items-center justify-center rounded-lg bg-ink/70 text-[#e5e5e5] backdrop-blur-md transition hover:bg-ink/85 ${className}`}
  >
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className={direction === 'previous' ? 'rotate-180' : undefined}
    >
      <path
        d="M1 7h12M8 2l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
)
