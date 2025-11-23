import { createRoute, type OpenAPIHono, z } from "@hono/zod-openapi"
import { Ollama } from "ollama"

const HealthSchema = z.object({
  status: z.enum(["ok", "alright", "degraded"]),
  ollama: z.enum(["connected", "disconnected"]),
  rag: z.enum(["ready", "not initialized"]),
  timestamp: z.string().openapi({ description: "Server timestamp", example: "2025-11-23T16:07:53.669Z" }),
})

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
const ollama = new Ollama({ host: process.env.OLLAMA_BASE_URL! })

export function registerInfoRoutes(app: OpenAPIHono) {
  app.openapi(healthRoute, async c => {
    const ollamaVersion = await ollama.version()
    const ollamaHealthy = !!ollamaVersion?.version
    const ragReady = true //ragService.isReady()

    const status = ollamaHealthy && ragReady ? "ok" : ollamaHealthy ? "alright" : "degraded"
    const statusCode = ollamaHealthy ? 200 : 503

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
    const url = new URL(c.req.url, `http://${c.req.header("host") || "localhost"}`)
    const docs = `${url.origin}${url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`}docs`
    return c.json({ timestamp: new Date().toISOString(), docs })
  })
  app.get("/robots.txt", c => c.text("User-agent: *\nDisallow: /"))
  app.get("/favicon.ico", c => c.body(null, 204))
}
