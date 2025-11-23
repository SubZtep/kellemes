import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import "dotenv/config"
import { migrateToLatest } from "../db/migrator"
// import chatRoutes from "./routes/chat.routes"
import infoRoutes from "./routes/info.routes"

const app = new Hono()

// Middleware
app.use("*", cors())
app.use("*", logger())

// Routes
// app.route("/api", chatRoutes)
app.route("/", infoRoutes)

// 404 handler
app.notFound(c => c.json({ error: "But our princess is in another castle!" }, 404))

// Error handler
app.onError((err, c) => {
  console.error("Unhandled error:", err)
  return c.json({ error: "Internal server error" }, 500)
})

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
