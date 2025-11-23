import { migrateToLatest } from "../db/migrator"

async function main(): Promise<void> {
  try {
    await migrateToLatest()
    console.log("All pending migrations have been applied")
    process.exit(0)
  } catch (error) {
    console.error("Migration run failed", error)
    process.exit(1)
  }
}

main()
