import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_founder_quote_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__founder_quote_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_users_sections" ADD VALUE 'founder-quote' BEFORE 'footer';
  ALTER TYPE "public"."enum_activity_log_section" ADD VALUE 'founder-quote' BEFORE 'footer';
  CREATE TABLE "founder_quote" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author_name" varchar,
  	"author_role" varchar,
  	"_status" "enum_founder_quote_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_founder_quote_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_quote" varchar,
  	"version_author_name" varchar,
  	"version_author_role" varchar,
  	"version__status" "enum__founder_quote_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE INDEX "founder_quote__status_idx" ON "founder_quote" USING btree ("_status");
  CREATE INDEX "_founder_quote_v_version_version__status_idx" ON "_founder_quote_v" USING btree ("version__status");
  CREATE INDEX "_founder_quote_v_created_at_idx" ON "_founder_quote_v" USING btree ("created_at");
  CREATE INDEX "_founder_quote_v_updated_at_idx" ON "_founder_quote_v" USING btree ("updated_at");
  CREATE INDEX "_founder_quote_v_latest_idx" ON "_founder_quote_v" USING btree ("latest");
  CREATE INDEX "_founder_quote_v_autosave_idx" ON "_founder_quote_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "founder_quote" CASCADE;
  DROP TABLE "_founder_quote_v" CASCADE;
  ALTER TABLE "users_sections" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_sections";
  CREATE TYPE "public"."enum_users_sections" AS ENUM('projects', 'services', 'clients', 'expertises', 'stats', 'footer', 'site-info');
  ALTER TABLE "users_sections" ALTER COLUMN "value" SET DATA TYPE "public"."enum_users_sections" USING "value"::"public"."enum_users_sections";
  ALTER TABLE "activity_log" ALTER COLUMN "section" SET DATA TYPE text;
  DROP TYPE "public"."enum_activity_log_section";
  CREATE TYPE "public"."enum_activity_log_section" AS ENUM('projects', 'services', 'clients', 'expertises', 'stats', 'footer', 'site-info', 'media', 'users');
  ALTER TABLE "activity_log" ALTER COLUMN "section" SET DATA TYPE "public"."enum_activity_log_section" USING "section"::"public"."enum_activity_log_section";
  DROP TYPE "public"."enum_founder_quote_status";
  DROP TYPE "public"."enum__founder_quote_v_version_status";`)
}
