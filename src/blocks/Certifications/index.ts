// Deliberately does not re-export `./config`. That is the Payload global, which
// pulls in the revalidation hook and therefore `next/cache` — importing it from a
// client component breaks the build. payload.config.ts imports it by path.
export { Certifications } from './Component'
export { certificationsPlaceholder } from './placeholder'
export { adaptCertifications } from './adapt'
export type { CertificationsProps, Certification } from './types'
