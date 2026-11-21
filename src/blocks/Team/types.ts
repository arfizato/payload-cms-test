export type TeamMember = {
  name: string
  /** Under the name: "Fondatrice & CEO". Omit to show the name alone. */
  role?: string
  photo: {
    src: string
    alt: string
  }
}

export type TeamProps = {
  /** Small pill above the heading. Omit to hide it. */
  badge?: string
  /** The heading, one entry per line — the break is part of the typography. */
  titleLines: string[]
  lede?: string
  members: TeamMember[]
  /**
   * `teaser` — the homepage: one row of four, roomy gaps, a link to the full team.
   * `full`   — /a-propos: rows of four set tight, `initialCount` at first and
   *            "Voir plus" for the rest, on the same page.
   */
  variant?: 'teaser' | 'full'
  /** How many show before "Voir plus" (full) or at all (teaser). Default 8 / 4. */
  initialCount?: number
  /** Dark button under the grid — the homepage's "Découvrir toute l'équipe". */
  cta?: { label: string; href: string }
}
