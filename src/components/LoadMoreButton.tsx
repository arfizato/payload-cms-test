import React from 'react'

/**
 * The design's outlined "Voir plus ↓": a wide hairline button, centred under a
 * grid, that reveals the next rows in place rather than leaving the page. Used
 * by the /projets grid and the team grid on /a-propos.
 *
 * `controls` is the id of the list it extends, so assistive tech can tie the
 * button to what changes when it is pressed.
 */
export const LoadMoreButton: React.FC<{
  onClick: () => void
  controls: string
  label?: string
}> = ({ onClick, controls, label = 'Voir plus' }) => (
  <div className="mt-[clamp(40px,4.5vw,64px)] flex justify-center">
    <button
      type="button"
      onClick={onClick}
      aria-controls={controls}
      className="inline-flex h-11 w-full max-w-[436px] items-center justify-center gap-2 rounded-md border border-ink text-[14px] font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
    >
      {label}
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14">
        <path
          d="M7 1v12M2 8l5 5 5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  </div>
)
