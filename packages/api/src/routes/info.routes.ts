import { createRoute } from "@hono/zod-openapi"
import { HealthSchema } from "@kellemes/common"
// import { ragService } from "@kellemes/rag"
import { Ollama } from "ollama"
import type { AppType } from "../app"

const healthRoute = createRoute({
  method: "get",
  path: "/health",
  summary: "Health status endpoint",
  responses: {
    200: {
      description: "API is healthy",
      content: {
        "application/json": {
          schema: HealthSchema,
        },
      },
    },
    503: {
      description: "API is degraded",
      summary: "Not fully functional",
      content: {
        "application/json": {
          schema: HealthSchema,
          examples: {
            degraded: {
              value: {
                status: "degraded",
                ollama: "connected",
                rag: "not initialized",
                timestamp: "2025-11-23T16:07:53.669Z",
              },
            },
          },
        },
      },
    },
  },
})

// Initialize Ollama client with custom host from environment
const ollama = new Ollama({ host: process.env.OLLAMA_HOST })

export function registerInfoRoutes(app: AppType) {
  app.openapi(healthRoute, async c => {
    const ollamaVersion = await ollama.version().catch(() => null)
    const ollamaHealthy = !!ollamaVersion?.version
    const ragReady = false //await ragService.isReady()

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

  app.get("/", c => {
    return c.json({
      name: "keLLeMes API",
      version: "1.0.0",
      endpoints: {
        chat: "POST /api/chat",
        retrieve: "POST /api/retrieve",
        stats: "GET /api/stats",
        health: "GET /health",
      },
    })
  })
  app.get("/robots.txt", c => c.text("User-agent: *\nDisallow: /"))
  app.get("/favicon.ico", c => c.body(null, 204))
}
