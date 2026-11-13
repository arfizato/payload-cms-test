import React from 'react'

/**
 * The design's "Section Tag" — the small plate with a square marker that sits
 * above a section heading.
 *
 * Three tones, all straight from the design's CSS:
 *   dark  — over a photograph: 40px high, 16/22 text, a fill so faint (5%) that
 *           the 1px shadow is what separates it from the image.
 *   light — on cream: 32px high, 14/22 text, half-transparent white behind a
 *           hairline accent border.
 *   ink   — on a flat ink section: 32px high, 14/22 text, a 35% white plate. It
 *           has no photograph to sit against, so it carries the contrast itself
 *           rather than relying on the shadow the `dark` tone uses.
 *
 * It renders a span, so the caller owns the spacing below it.
 */
export const SectionTag: React.FC<{
  children: React.ReactNode
  tone?: 'dark' | 'light' | 'ink'
}> = ({ children, tone = 'dark' }) => {
  const plate = {
    dark: 'h-10 px-4 text-[16px] bg-[#E5E5E5]/5 text-[#E5E5E5] shadow-[0_0_1px_rgba(0,0,0,0.32)]',
    light:
      'h-8 px-[13px] text-[14px] border-[0.5px] border-accent bg-[rgba(255,255,255,0.51)] text-accent shadow-[0_0_1px_rgba(169,30,35,0.32)]',
    ink: 'h-8 px-[13px] text-[14px] bg-white/35 text-cream',
  }[tone]

  const marker = tone === 'light' ? 'bg-accent' : tone === 'ink' ? 'bg-cream' : 'bg-[#E5E5E5]'

  return (
    <span className={`inline-flex items-center gap-2 rounded-[4px] leading-[22px] ${plate}`}>
      <span aria-hidden="true" className={`inline-block size-3 flex-none ${marker}`} />
      {children}
    </span>
  )
}
