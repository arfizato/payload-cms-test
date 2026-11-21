export type Certification = {
  /** The small label under the heading. */
  brand: string
  heading: string
  body: string
  /** The label in the dark strip along the card's foot. Omit to hide the strip. */
  certification?: string
}

export type CertificationsProps = {
  /** Small pill above the heading. Omit to hide it. */
  badge?: string
  /** The heading, one entry per line — the break is part of the typography. */
  titleLines: string[]
  lede?: string
  items: Certification[]
  /**
   * Centred button under the cards. Feedback asked for one leading to Nos
   * métiers, so the reader goes from the products to the trades that fit them.
   * Hardcoded by the page, like the other page chrome. Omit to hide it.
   */
  cta?: { label: string; href: string }
}
