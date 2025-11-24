import { serve } from "@hono/node-server"
import "dotenv/config"
import { migrateToLatest } from "../db/migrator.js"
import { app } from "./app.js"
import { registerDocs } from "./docs.js"
import { registerMiddleware } from "./middlewares.js"
import { registerRoutes } from "./routes/index.js"

let server: ReturnType<typeof serve> | null = null

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

  server = serve({
    fetch: app.fetch,
    port: Number(process.env.API_PORT),
  })
} catch (error) {
  console.error("Failed to start server:", error)
  process.exit(1)
}

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`\n${signal} received. Shutting down gracefully...`)
  if (!server) {
    return process.exit(0)
  }
  server.close(() => {
    process.exit(0)
  })
}

const shutdownSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"]
shutdownSignals.forEach(signal => {
  process.on(signal, () => shutdown(signal))
})
