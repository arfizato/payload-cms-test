import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_users_sections" ADD VALUE 'articles' BEFORE 'services';
  ALTER TYPE "public"."enum_users_sections" ADD VALUE 'article-categories' BEFORE 'services';
  ALTER TYPE "public"."enum_activity_log_section" ADD VALUE 'articles' BEFORE 'services';
  ALTER TYPE "public"."enum_activity_log_section" ADD VALUE 'article-categories' BEFORE 'services';
  CREATE TABLE "article_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"category_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_image_id" integer,
  	"version_category_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "article_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "articles_id" integer;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_article_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."article_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_category_id_article_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."article_categories"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "article_categories_title_idx" ON "article_categories" USING btree ("title");
  CREATE INDEX "article_categories_updated_at_idx" ON "article_categories" USING btree ("updated_at");
  CREATE INDEX "article_categories_created_at_idx" ON "article_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_image_idx" ON "articles" USING btree ("image_id");
  CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");
  CREATE INDEX "articles_published_at_idx" ON "articles" USING btree ("published_at");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_image_idx" ON "_articles_v" USING btree ("version_image_id");
  CREATE INDEX "_articles_v_version_version_category_idx" ON "_articles_v" USING btree ("version_category_id");
  CREATE INDEX "_articles_v_version_version_published_at_idx" ON "_articles_v" USING btree ("version_published_at");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_article_categories_fk" FOREIGN KEY ("article_categories_id") REFERENCES "public"."article_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_article_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("article_categories_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");`)

  const body = {
    root: {
      type: 'root', version: 1, direction: 'ltr', format: '', indent: 0,
      children: [
        'Une signalétique claire commence par les parcours. Depuis l’entrée, chaque indication doit répondre à la question que le visiteur se pose à cet endroit.',
        'Les matériaux, la typographie et les contrastes contribuent à rendre ces indications lisibles tout en prolongeant l’identité de l’entreprise. Ce texte d’exemple est à remplacer dans Payload.',
      ].map((text) => ({
        type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0,
        children: [{ type: 'text', version: 1, text, format: 0, detail: 0, mode: 'normal', style: '' }],
      })),
    },
  }

  // Seed against this migration's schema, independent of fields added in later migrations.
  await db.execute(sql`
    WITH categories AS (
      INSERT INTO "article_categories" ("title")
      VALUES ('Cloisonnement'), ('Signalétique'), ('Traitement du vitrage'),
             ('Habillage'), ('Agencement'), ('Workspace')
      RETURNING "id", "title"
    ), sample AS (
      INSERT INTO "articles" ("title", "slug", "generate_slug", "excerpt", "category_id", "published_at", "_status", "body")
      SELECT 'La signalétique corporate : un outil essentiel pour l’image de l’entreprise',
             'signaletique-corporate', false,
             'Comment une signalétique bien pensée aide les visiteurs à se repérer et donne aux espaces de travail une identité cohérente.',
             "id", '2025-07-01T00:00:00.000Z', 'published', ${JSON.stringify(body)}::jsonb
      FROM categories WHERE "title" = 'Signalétique'
      RETURNING *
    )
    INSERT INTO "_articles_v" ("parent_id", "version_title", "version_slug", "version_generate_slug", "version_excerpt",
      "version_category_id", "version_published_at", "version__status", "version_body", "version_created_at", "version_updated_at", "latest")
    SELECT "id", "title", "slug", "generate_slug", "excerpt", "category_id", "published_at", 'published',
           "body", "created_at", "updated_at", true
    FROM sample;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "article_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "articles_id";
  DELETE FROM "users_sections" WHERE "value" IN ('articles', 'article-categories');
  UPDATE "activity_log" SET "section" = NULL WHERE "section" IN ('articles', 'article-categories');
   ALTER TABLE "article_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "article_categories" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  ALTER TABLE "users_sections" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_sections";
  CREATE TYPE "public"."enum_users_sections" AS ENUM('projects', 'services', 'clients', 'testimonials', 'team-members', 'expertises', 'stats', 'founder-quote', 'certifications', 'footer', 'site-info');
  ALTER TABLE "users_sections" ALTER COLUMN "value" SET DATA TYPE "public"."enum_users_sections" USING "value"::"public"."enum_users_sections";
  ALTER TABLE "activity_log" ALTER COLUMN "section" SET DATA TYPE text;
  DROP TYPE "public"."enum_activity_log_section";
  CREATE TYPE "public"."enum_activity_log_section" AS ENUM('projects', 'services', 'clients', 'testimonials', 'team-members', 'expertises', 'stats', 'founder-quote', 'certifications', 'footer', 'site-info', 'media', 'users');
  ALTER TABLE "activity_log" ALTER COLUMN "section" SET DATA TYPE "public"."enum_activity_log_section" USING "section"::"public"."enum_activity_log_section";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_status";`)
}
