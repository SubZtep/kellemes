import { serve } from "@hono/node-server"
import "dotenv/config"
import { migrateToLatest } from "../db/migrator"
import { app } from "./app"
import { registerDocs } from "./config/docs"
import { registerMiddleware } from "./middleware"
import { registerRoutes } from "./routes"

// Setup middleware
registerMiddleware(app)

// Register routes
registerRoutes(app)

// Register documentation
registerDocs(app)

// Initialize and start server
async function startServer() {
  try {
    console.log("=== keLLeMes API ===\n")

    // Run database migrations
    console.log("Running database migrations...")
    await migrateToLatest()
    console.log("✓ Migrations complete\n")

    // Start Hono server
    console.log(`✓ Server running on http://localhost:${process.env.API_PORT}`)
    console.log(`✓ Environment: ${process.env.NODE_ENV}\n`)

    serve({
      fetch: app.fetch,
      port: Number(process.env.API_PORT),
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => {
  console.log("\nShutting down gracefully...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("\nShutting down gracefully...")
  process.exit(0)
})

startServer()
