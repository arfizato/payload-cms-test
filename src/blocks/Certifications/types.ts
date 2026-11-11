export type Certification = {
  /** The brand pill at the top of the card. */
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
}
