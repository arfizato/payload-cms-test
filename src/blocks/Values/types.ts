export type Value = {
  name: string
  description: string
}

export type ValuesProps = {
  /** Small pill above the heading. Omit to hide it. */
  badge?: string
  /** The heading, one entry per line — the break is part of the typography. */
  titleLines: string[]
  /**
   * The values, in order. The design's "01"–"04" are not stored: they are the
   * position, so they are rendered from the index and cannot fall out of step
   * with it.
   */
  items: Value[]
}
