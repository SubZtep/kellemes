import "dotenv/config"
import { migrateToLatest } from "../db/migrator.js"
import { app } from "./app.js"
import { registerDocs } from "./docs.js"
import { registerMiddleware } from "./middlewares.js"
import { registerRoutes } from "./routes/index.js"

registerMiddleware(app)
registerRoutes(app)
await registerDocs(app)

try {
  console.log("=== keLLeMes API ===\n")
  console.log("Running database migrations...")
  await migrateToLatest()

  console.log("✓ Migrations complete\n")
  console.log(`✓ Server running on http://localhost:${process.env.API_PORT}`)
  console.log(`✓ Environment: ${process.env.NODE_ENV}\n`)
} catch (error) {
  console.error("Failed to start server:", error)
  process.exit(1)
}

export default {
  port: Number(process.env.API_PORT),
  fetch: app.fetch,
}
