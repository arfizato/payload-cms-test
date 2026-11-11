import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_certifications_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__certifications_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_users_sections" ADD VALUE 'certifications' BEFORE 'footer';
  ALTER TYPE "public"."enum_activity_log_section" ADD VALUE 'certifications' BEFORE 'footer';
  CREATE TABLE "certifications_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "certifications_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"brand" varchar,
  	"certification" varchar,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "certifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"lede" varchar,
  	"_status" "enum_certifications_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_certifications_v_version_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_certifications_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand" varchar,
  	"certification" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_certifications_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_badge" varchar,
  	"version_lede" varchar,
  	"version__status" "enum__certifications_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "certifications_heading_lines" ADD CONSTRAINT "certifications_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "certifications_items" ADD CONSTRAINT "certifications_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_certifications_v_version_heading_lines" ADD CONSTRAINT "_certifications_v_version_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_certifications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_certifications_v_version_items" ADD CONSTRAINT "_certifications_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_certifications_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "certifications_heading_lines_order_idx" ON "certifications_heading_lines" USING btree ("_order");
  CREATE INDEX "certifications_heading_lines_parent_id_idx" ON "certifications_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "certifications_items_order_idx" ON "certifications_items" USING btree ("_order");
  CREATE INDEX "certifications_items_parent_id_idx" ON "certifications_items" USING btree ("_parent_id");
  CREATE INDEX "certifications__status_idx" ON "certifications" USING btree ("_status");
  CREATE INDEX "_certifications_v_version_heading_lines_order_idx" ON "_certifications_v_version_heading_lines" USING btree ("_order");
  CREATE INDEX "_certifications_v_version_heading_lines_parent_id_idx" ON "_certifications_v_version_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "_certifications_v_version_items_order_idx" ON "_certifications_v_version_items" USING btree ("_order");
  CREATE INDEX "_certifications_v_version_items_parent_id_idx" ON "_certifications_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_certifications_v_version_version__status_idx" ON "_certifications_v" USING btree ("version__status");
  CREATE INDEX "_certifications_v_created_at_idx" ON "_certifications_v" USING btree ("created_at");
  CREATE INDEX "_certifications_v_updated_at_idx" ON "_certifications_v" USING btree ("updated_at");
  CREATE INDEX "_certifications_v_latest_idx" ON "_certifications_v" USING btree ("latest");
  CREATE INDEX "_certifications_v_autosave_idx" ON "_certifications_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "certifications_heading_lines" CASCADE;
  DROP TABLE "certifications_items" CASCADE;
  DROP TABLE "certifications" CASCADE;
  DROP TABLE "_certifications_v_version_heading_lines" CASCADE;
  DROP TABLE "_certifications_v_version_items" CASCADE;
  DROP TABLE "_certifications_v" CASCADE;
  ALTER TABLE "users_sections" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_sections";
  CREATE TYPE "public"."enum_users_sections" AS ENUM('projects', 'services', 'clients', 'expertises', 'stats', 'founder-quote', 'footer', 'site-info');
  ALTER TABLE "users_sections" ALTER COLUMN "value" SET DATA TYPE "public"."enum_users_sections" USING "value"::"public"."enum_users_sections";
  ALTER TABLE "activity_log" ALTER COLUMN "section" SET DATA TYPE text;
  DROP TYPE "public"."enum_activity_log_section";
  CREATE TYPE "public"."enum_activity_log_section" AS ENUM('projects', 'services', 'clients', 'expertises', 'stats', 'founder-quote', 'footer', 'site-info', 'media', 'users');
  ALTER TABLE "activity_log" ALTER COLUMN "section" SET DATA TYPE "public"."enum_activity_log_section" USING "section"::"public"."enum_activity_log_section";
  DROP TYPE "public"."enum_certifications_status";
  DROP TYPE "public"."enum__certifications_v_version_status";`)
}
