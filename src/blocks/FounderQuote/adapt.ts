import type { FounderQuote as PayloadFounderQuote } from '@/payload-types'

import type { FounderQuoteProps } from './types'

/**
 * Payload document → component props.
 *
 * `quote` and `authorName` are required fields, but the generated type still
 * makes them nullable, so both fall back to an empty string; the component
 * renders nothing when the quote is empty rather than an outlined empty card.
 */
export const adaptFounderQuote = (doc: PayloadFounderQuote): FounderQuoteProps => ({
  quote: doc.quote ?? '',
  author: {
    name: doc.authorName ?? '',
    role: doc.authorRole ?? undefined,
  },
})
