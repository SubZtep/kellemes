import type { Kysely } from "kysely"
import { sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  // Enable pgvector extension
  await sql`CREATE EXTENSION IF NOT EXISTS vector`.execute(db)

  // Create qa_vectors table
  await db.schema
    .createTable("qa_vectors")
    .addColumn("id", "varchar", col => col.primaryKey())
    .addColumn("question", "text", col => col.notNull())
    .addColumn("answer", "text", col => col.notNull())
    .addColumn("embedding", sql`vector(768)`, col => col.notNull())
    .execute()

  // Create index for vector similarity search
  await sql`CREATE INDEX ON qa_vectors USING ivfflat (embedding vector_cosine_ops)`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("qa_vectors").execute()
  await sql`DROP EXTENSION IF EXISTS vector`.execute(db)
}
