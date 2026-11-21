export type ClientLogo = {
  src: string
  alt: string
  /** Intrinsic size of the asset; CSS normalises every logo to one height. */
  width: number
  height: number
  /** Optional — wraps the logo in a link when present. */
  href?: string
}

export type ClientLogosProps = {
  items: ClientLogo[]
  /**
   * Seconds for one full loop. Higher is slower. Because the track length grows
   * with the number of logos, adjust this if you add or remove several.
   */
  speedSeconds?: number
  /**
   * `light` — cream band, logos in their own colours dulled to grey. The homepage.
   * `dark`  — ink band, every logo knocked out to white. The inner pages, where
   *           the band runs straight on from a dark hero; the client asked to
   *           see the logos white on dark and kept it.
   */
  tone?: 'light' | 'dark'
}
