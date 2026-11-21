export type Testimonial = {
  /** The quotation, without quote marks — the design has none. */
  quote: string
  /** First name and initial, as the design prints them: "Emna A." */
  author: string
  /** Role and company on one line: "COO chez Ooredoo". */
  role?: string
  /** Out of five. Defaults to five; the design shows nothing else. */
  rating?: number
  /**
   * Beside the name. `logo` is the client's brand mark, drawn uncropped; `avatar`
   * is a portrait, cropped to a circle. Feedback asked for client logos, so
   * prefer `logo` — the avatars are what the design used before that.
   */
  image?: {
    src: string
    alt: string
    kind: 'logo' | 'avatar'
    /** Intrinsic size, for the logo's aspect ratio. Avatars are square. */
    width: number
    height: number
  }
}

export type TestimonialsProps = {
  /** Small pill above the heading. Omit to hide it. */
  badge?: string
  /** The heading, one entry per line — the break is part of the typography. */
  titleLines: string[]
  lede?: string
  items: Testimonial[]
}
