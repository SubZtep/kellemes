// import { ragService } from "@kellemes/core"
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"
import { Scalar } from "@scalar/hono-api-reference"
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

const app = new OpenAPIHono()

// Initialize Ollama client with custom host from environment
const ollama = new Ollama({ host: process.env.OLLAMA_BASE_URL! })

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

app.get("/", c => c.json({ timestamp: new Date().toISOString() }))
app.get("/robots.txt", c => c.text("User-agent: *\nDisallow: /"))
app.get("/favicon.ico", c => c.body(null, 204))

app.doc("/openapi", {
  openapi: "3.0.0",
  externalDocs: {
    url: "https://github.com/SubZtep/kellemes",
    description: "GitHub repository ",
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Local development",
    },
  ],
  info: {
    title: "keLLeMes API",
    version: "1.0.0",
  },
})

app.get(
  "/docs",
  Scalar({
    url: "/openapi",
    theme: "elysiajs",
    showDeveloperTools: "never",
    pageTitle: "keLLeMes API Documentation",
    darkMode: true,
    defaultHttpClient: {
      targetKey: "node",
      clientKey: "fetch",
    },
    forceDarkModeState: "dark",
    hideDarkModeToggle: true,
    telemetry: false,
  }),
)

export default app
