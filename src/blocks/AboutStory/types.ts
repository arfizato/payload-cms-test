export type AboutStoryProps = {
  /** Small pill above the heading. Omit to hide it. */
  badge?: string
  /**
   * The heading, one entry per line.
   *
   * The design breaks it after "Un modèle hybride." and the break is part of
   * the typography, not a consequence of the column width — so it is given
   * rather than left to wrapping.
   */
  titleLines: string[]
  /**
   * Body copy. The design sets these as one dense block with no gap between
   * paragraphs, so they are separate entries for semantics, not for spacing.
   */
  paragraphs: string[]
  image: {
    src: string
    alt: string
    /** CSS `object-position` for the crop. Defaults to `center`. */
    focalPoint?: string
  }
}
