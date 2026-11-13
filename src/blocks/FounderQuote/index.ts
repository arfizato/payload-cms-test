// Deliberately does not re-export `./config`. That is the Payload global, which
// pulls in the revalidation hook and therefore `next/cache` — importing it from a
// client component breaks the build. payload.config.ts imports it by path.
export { FounderQuote } from './Component'
export { founderQuotePlaceholder } from './placeholder'
export { adaptFounderQuote } from './adapt'
export type { FounderQuoteProps } from './types'
