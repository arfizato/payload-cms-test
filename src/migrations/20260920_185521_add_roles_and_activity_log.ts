import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_sections" AS ENUM('projects', 'services', 'clients', 'expertises', 'stats', 'footer', 'site-info');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_activity_log_action" AS ENUM('created', 'published', 'unpublished', 'updated', 'deleted', 'permissions');
  CREATE TYPE "public"."enum_activity_log_section" AS ENUM('projects', 'services', 'clients', 'expertises', 'stats', 'footer', 'site-info', 'media', 'users');
  CREATE TABLE "users_sections" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_sections",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "activity_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_label" varchar,
  	"action" "enum_activity_log_action",
  	"section" "enum_activity_log_section",
  	"document_title" varchar,
  	"user_id" integer,
  	"document_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "name" varchar;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'editor' NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "clients_id" integer;
  ALTER TABLE "users_sections" ADD CONSTRAINT "users_sections_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sections_order_idx" ON "users_sections" USING btree ("order");
  CREATE INDEX "users_sections_parent_idx" ON "users_sections" USING btree ("parent_id");
  CREATE INDEX "activity_log_user_idx" ON "activity_log" USING btree ("user_id");
  CREATE INDEX "activity_log_updated_at_idx" ON "activity_log" USING btree ("updated_at");
  CREATE INDEX "activity_log_created_at_idx" ON "activity_log" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");`)

  // Hand-written, and load-bearing.
  //
  // The column above lands with DEFAULT 'editor', so every account that already
  // exists becomes an editor with no sections — an empty sidebar, and no way back
  // in, because only an admin can change a role. The accounts predating roles are
  // the people who own the site, so they become admins.
  //
  // New accounts still default to 'editor'; this only touches the rows that were
  // there before the column was.
  await db.execute(sql`UPDATE "users" SET "role" = 'admin';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "activity_log" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_sections" CASCADE;
  DROP TABLE "activity_log" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_clients_fk";
  
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_clients_id_idx";
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "clients_id";
  DROP TYPE "public"."enum_users_sections";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_activity_log_action";
  DROP TYPE "public"."enum_activity_log_section";`)
}
