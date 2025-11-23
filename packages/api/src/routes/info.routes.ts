// import { ragService } from "@kellemes/core"
import { Hono } from "hono"
import { Ollama } from "ollama"

const app = new Hono()

// Initialize Ollama client with custom host from environment
const ollama = new Ollama({
  host: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
})

/**
 * GET /
 * Root endpoint
 */
app.get("/", c => c.json({ timestamp: new Date().toISOString() }))

/**
 * GET /health
 * Health check
 */
app.get("/health", async c => {
  const ollamaVersion = await ollama.version()
  const ollamaHealthy = !!ollamaVersion?.version
  const ragReady = true //ragService.isReady()

  const status = ollamaHealthy && ragReady ? "healthy" : ollamaHealthy ? "alright" : "degraded"
  const statusCode = ollamaHealthy ? 200 : 503

  return c.json(
    {
      status,
      ollama: ollamaHealthy ? "connected" : "disconnected",
      rag: "wip", //ragReady ? "ready" : "not initialized",
      timestamp: new Date().toISOString(),
    },
    statusCode,
  )
})

export default app
