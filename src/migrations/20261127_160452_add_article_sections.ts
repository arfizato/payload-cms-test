import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "articles_sections_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "articles_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb
  );
  
  CREATE TABLE "_articles_v_version_sections_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"_uuid" varchar
  );
  
  ALTER TABLE "articles" ADD COLUMN "detail_image_id" integer;
  ALTER TABLE "_articles_v" ADD COLUMN "version_detail_image_id" integer;
  ALTER TABLE "articles_sections_images" ADD CONSTRAINT "articles_sections_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_sections_images" ADD CONSTRAINT "articles_sections_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_sections" ADD CONSTRAINT "articles_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_sections_images" ADD CONSTRAINT "_articles_v_version_sections_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_version_sections_images" ADD CONSTRAINT "_articles_v_version_sections_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_sections" ADD CONSTRAINT "_articles_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_sections_images_order_idx" ON "articles_sections_images" USING btree ("_order");
  CREATE INDEX "articles_sections_images_parent_id_idx" ON "articles_sections_images" USING btree ("_parent_id");
  CREATE INDEX "articles_sections_images_image_idx" ON "articles_sections_images" USING btree ("image_id");
  CREATE INDEX "articles_sections_order_idx" ON "articles_sections" USING btree ("_order");
  CREATE INDEX "articles_sections_parent_id_idx" ON "articles_sections" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_version_sections_images_order_idx" ON "_articles_v_version_sections_images" USING btree ("_order");
  CREATE INDEX "_articles_v_version_sections_images_parent_id_idx" ON "_articles_v_version_sections_images" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_version_sections_images_image_idx" ON "_articles_v_version_sections_images" USING btree ("image_id");
  CREATE INDEX "_articles_v_version_sections_order_idx" ON "_articles_v_version_sections" USING btree ("_order");
  CREATE INDEX "_articles_v_version_sections_parent_id_idx" ON "_articles_v_version_sections" USING btree ("_parent_id");
  ALTER TABLE "articles" ADD CONSTRAINT "articles_detail_image_id_media_id_fk" FOREIGN KEY ("detail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_detail_image_id_media_id_fk" FOREIGN KEY ("version_detail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "articles_detail_image_idx" ON "articles" USING btree ("detail_image_id");
  CREATE INDEX "_articles_v_version_version_detail_image_idx" ON "_articles_v" USING btree ("version_detail_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles_sections_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_version_sections_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_version_sections" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "articles_sections_images" CASCADE;
  DROP TABLE "articles_sections" CASCADE;
  DROP TABLE "_articles_v_version_sections_images" CASCADE;
  DROP TABLE "_articles_v_version_sections" CASCADE;
  ALTER TABLE "articles" DROP CONSTRAINT "articles_detail_image_id_media_id_fk";
  
  ALTER TABLE "_articles_v" DROP CONSTRAINT "_articles_v_version_detail_image_id_media_id_fk";
  
  DROP INDEX "articles_detail_image_idx";
  DROP INDEX "_articles_v_version_version_detail_image_idx";
  ALTER TABLE "articles" DROP COLUMN "detail_image_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_detail_image_id";`)
}
