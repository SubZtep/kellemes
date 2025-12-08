import { SQL } from "bun"
import { CamelCasePlugin, Kysely } from "kysely"
import { PostgresJSDialect } from "kysely-postgres-js"
import type { Database } from "./types"

// console.log("DATABASE_URL", process.env.DATABASE_URL)
const dialect = new PostgresJSDialect({
  postgres: new SQL({
    adapter: "postgres",
    url: process.env.DATABASE_URL,
    max: 10,
    // tls: false,
  }),
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
// CamelCasePlugin converts snake_case DB columns to camelCase JS properties.
export const db = new Kysely<Database>({
  dialect,
  // dialect: new PostgresDialect({
  //   pool: new Pool({
  //     connectionString: process.env.DATABASE_URL,
  //     keepAlive: true,
  //     log: console.log,
  //     ssl: false,
  //     max: 10,
  //   }),
  // }),
  // dialect: new PostgresJSDialect({
  //   postgres: new SQL({
  //     database: process.env.POSTGRES_DB,
  //     host: process.env.POSTGRES_HOST,
  //     max: 10,
  //     port: Number(process.env.POSTGRES_PORT),
  //     user: process.env.POSTGRES_USER,
  //     password: process.env.POSTGRES_PASSWORD,
  //   }),
  // }),
  plugins: [new CamelCasePlugin()],
})
