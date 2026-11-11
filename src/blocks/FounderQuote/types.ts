export type FounderQuoteProps = {
  /** The quotation itself, without surrounding quote marks — the design has none. */
  quote: string
  author: {
    name: string
    /** Title and company, on its own line under the name. Omit to hide it. */
    role?: string
  }
}
