export type MissionVisionCard = {
  heading: string
  body: string
  /**
   * `primary` is the design's left card: a faint accent wash behind a
   * full-strength accent border, with a cream square in the corner.
   * `secondary` sits flat on the section's cream with a half-strength border
   * and an accent square. A presentation difference over identical data.
   */
  variant: 'primary' | 'secondary'
}

export type MissionVisionProps = {
  /** Small pill above the heading. Omit to hide it. */
  badge?: string
  /** The heading, one entry per line — the break is part of the typography. */
  titleLines: string[]
  cards: MissionVisionCard[]
}
