import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { ActivityLog } from './collections/ActivityLog'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Projects } from './collections/Projects'
import { Clients } from './collections/Clients'
import { ExpertisesGlobal } from './blocks/Expertises/config'
import { StatsGlobal } from './blocks/Stats/config'
import { FounderQuoteGlobal } from './blocks/FounderQuote/config'
import { CertificationsGlobal } from './blocks/Certifications/config'
import { FooterGlobal } from './blocks/Footer/config'
import { SiteInfoGlobal } from './globals/SiteInfo'

// R2 speaks the S3 API. Only enabled when credentials exist, so local dev
// without them keeps writing uploads to disk instead of failing at boot.
const r2Configured = Boolean(
  process.env.R2_BUCKET && process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID,
)

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Media, Services, Projects, Clients, ActivityLog],
  globals: [
    SiteInfoGlobal,
    StatsGlobal,
    ExpertisesGlobal,
    FounderQuoteGlobal,
    CertificationsGlobal,
    FooterGlobal,
  ],
  // Each user picks their language on their account page; a first login follows
  // the browser. French is the fallback because the client's team works in it.
  // Our own labels are { fr, en } pairs — the shared ones are in src/admin/i18n.ts.
  i18n: {
    supportedLanguages: { fr, en },
    fallbackLanguage: 'fr',
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Postgres in production — a serverless filesystem is ephemeral, so a SQLite
  // file would be wiped on every deploy. Picked from the connection string itself
  // so there is no second flag to keep in sync; local dev stays on SQLite.
  //
  // `push: false` is deliberate. Dev push applies schema changes directly and
  // leaves no history, which is how this database ended up marked `dev` with no
  // migration ever applied — and why every Netlify build sat 5 minutes on an
  // interactive prompt nobody could answer. Schema changes now go through
  // `pnpm payload migrate:create <name>` and a committed file.
  db: process.env.DATABASE_URL?.startsWith('postgres')
    ? postgresAdapter({
        pool: { connectionString: process.env.DATABASE_URL },
        push: false,
      })
    : sqliteAdapter({
        client: { url: process.env.DATABASE_URL || '' },
        push: false,
      }),
  sharp,
  plugins: r2Configured
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.R2_BUCKET as string,
          config: {
            endpoint: process.env.R2_ENDPOINT,
            // R2 ignores regions but the S3 client requires one.
            region: 'auto',
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            },
          },
        }),
      ]
    : [],
})
