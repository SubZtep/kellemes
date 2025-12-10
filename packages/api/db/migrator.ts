import { promises as fs } from "node:fs"
import path from "node:path"
import { FileMigrationProvider, Migrator } from "kysely"
import { db } from "./database"

const migrationFolder = path.join(import.meta.dir, "migrations")

export const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    migrationFolder,
    path,
  }),
})

export async function migrateToLatest(): Promise<void> {
  const { error, results } = await migrator.migrateToLatest()

  for (const result of results ?? []) {
    if (result.status === "Success") {
      console.log(`Migration "${result.migrationName}" executed`)
    } else if (result.status === "Error") {
      console.error(`Migration "${result.migrationName}" failed`, result)
    }
  }

  if (error) {
    console.error("Failed to migrate", error)
    throw error
  }
}

export async function rollbackLatest(): Promise<void> {
  const { error, results } = await migrator.migrateDown()

  for (const result of results ?? []) {
    if (result.status === "Success") {
      console.log(`Rolled back "${result.migrationName}"`)
    } else if (result.status === "Error") {
      console.error(`Rollback for "${result.migrationName}" failed`, result)
    }
  }

  if (error) {
    console.error("Failed to rollback", error)
    throw error
  }
}
