export type HeroProps = {
  /** Small pill above the headline. Omit to hide it. */
  badge?: string
  title: string
  lede?: string
  /** Omit for a hero that ends on the lede — the Nos métiers frame has no button. */
  cta?: {
    label: string
    href: string
  }
  image: {
    src: string
    mobileSrc?: string
    alt: string
    /**
     * CSS `object-position` for the crop. The band is always one viewport tall,
     * which on a wide monitor is a wider box than any of these photos — so
     * `object-cover` trims roughly a fifth of the height whatever we do. This
     * picks which fifth goes. Defaults to `center 62%`.
     */
    focalPoint?: string
  }
}
