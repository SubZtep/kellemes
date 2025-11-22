import { ollamaService, ragService } from "@kellemes/core"
import { Hono } from "hono"

const app = new Hono()

/**
 * GET /health
 * Health check
 */
app.get("/health", async c => {
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

export default app
