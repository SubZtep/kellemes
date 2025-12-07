import { betterAuth } from "better-auth"
import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"
import type { Database } from "../../db/types.js"

// Use pg Pool for Better Auth (works in both Bun and Node.js)
// This allows Better Auth CLI to read the config without Bun import errors
const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.POSTGRES_HOST || "localhost",
      port: Number(process.env.POSTGRES_PORT || 5432),
      database: process.env.POSTGRES_DB || "kellemes",
      user: process.env.POSTGRES_USER || "kellemes",
      password: process.env.POSTGRES_PASSWORD || "",
      max: 10,
    }),
  }),
})

export const auth = betterAuth({
  database: {
    db,
    type: "postgres",
  },
  experimental: { joins: true },
  secret: process.env.BETTER_AUTH_SECRET || "change-me",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8080",
  emailAndPassword: {
    enabled: true,
  },
})
