export type Entity = {
  name: string
  /** One line under the name — what the entity does. */
  tagline: string
  description: string
  /**
   * Two of the four cards are tinted in the design. `accent` leans red,
   * `ember` leans orange; the rest stay flat. Presentation only.
   */
  tint?: 'accent' | 'ember'
}

export type EntitiesProps = {
  /** Small pill above the heading. Omit to hide it. */
  badge?: string
  /** The heading, one entry per line — the break is part of the typography. */
  titleLines: string[]
  lede?: string
  items: Entity[]
}
