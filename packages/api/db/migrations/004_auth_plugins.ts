import type { Kysely } from "kysely"
import { sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  // Add is_anonymous column for anonymous plugin
  await sql`ALTER TABLE "user" ADD COLUMN "is_anonymous" boolean NOT NULL DEFAULT false`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`ALTER TABLE "user" DROP COLUMN "is_anonymous"`.execute(db)
}
