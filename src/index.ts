import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import config from "./config"
import chatRoutes from "./routes/chat.routes"
import { ollamaService } from "./services/ollama.service"
import { ragService } from "./services/rag.service"

const app = new Hono()

// Middleware
app.use("*", cors())
app.use("*", logger())

// Routes
app.route("/api", chatRoutes)

// Health check
app.get("/health", async (c) => {
  const ollamaHealthy = await ollamaService.checkHealth()
  const ragReady = ragService.isReady()

  const status = ollamaHealthy && ragReady ? "healthy" : "degraded"
  const statusCode = status === "healthy" ? 200 : 503

  return c.json(
    {
      status,
      ollama: ollamaHealthy ? "connected" : "disconnected",
      rag: ragReady ? "ready" : "not initialized",
      timestamp: new Date().toISOString(),
    },
    statusCode,
  )
})

// Root endpoint
app.get("/", (c) => {
  return c.json({
    name: "keLLeMes RAG API",
    version: "1.0.0",
    endpoints: {
      chat: "POST /api/chat",
      retrieve: "POST /api/retrieve",
      stats: "GET /api/stats",
      health: "GET /health",
    },
  })
})

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: "Endpoint not found",
    },
    404,
  )
})

// Error handler
app.onError((err, c) => {
  console.error("Unhandled error:", err)
  return c.json(
    {
      error: "Internal server error",
    },
    500,
  )
})

// Initialize and start server
async function startServer() {
  try {
    console.log("=== keLLeMes RAG Server ===\n")

    // Check Ollama connection
    console.log("Checking Ollama connection...")
    const isHealthy = await ollamaService.checkHealth()

    if (!isHealthy) {
      console.warn("⚠ Warning: Ollama is not running or not accessible")
      console.warn("The server will start, but RAG features will not work")
      console.warn("Please start Ollama and ensure models are available\n")
    } else {
      console.log("✓ Ollama is running\n")
    }

    // Initialize RAG service
    console.log("Initializing RAG service...")
    await ragService.initialize()

    if (!ragService.isReady()) {
      console.warn("⚠ Warning: RAG database is empty")
      console.warn("Run `npm run ingest` to populate the vector database\n")
    } else {
      const stats = ragService.getStats()
      console.log(`✓ RAG service ready with ${stats.totalDocuments} documents\n`)
    }

    // Start Hono server
    console.log(`✓ Server running on http://localhost:${config.port}`)
    console.log(`✓ Environment: ${config.nodeEnv}\n`)
    console.log("Available endpoints:")
    console.log(`  POST   http://localhost:${config.port}/api/chat`)
    console.log(`  POST   http://localhost:${config.port}/api/retrieve`)
    console.log(`  GET    http://localhost:${config.port}/api/stats`)
    console.log(`  GET    http://localhost:${config.port}/health\n`)

    serve({
      fetch: app.fetch,
      port: config.port,
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down gracefully...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("\nShutting down gracefully...")
  process.exit(0)
})

// Start the server
startServer()
