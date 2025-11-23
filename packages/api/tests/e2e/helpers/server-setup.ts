import type { Server } from "node:http"
import type { AddressInfo } from "node:net"
import { serve } from "@hono/node-server"
import { ollamaService } from "@kellemes/ollama-service"
import { ragService } from "@kellemes/rag-service"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import chatRoutes from "../../../src/routes/chat.routes"

let server: Server | null = null

export async function startTestServer(): Promise<string> {
  const app = new Hono()

  // Middleware
  app.use("*", cors())
  app.use("*", logger())

  // Routes
  app.route("/api", chatRoutes)

  // Health check
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

  // Root endpoint
  app.get("/", c => {
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
  app.notFound(c => {
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

  // Initialize RAG service
  await ragService.initialize()

  // Start server on a random available port
  server = serve({
    fetch: app.fetch,
    port: 0, // Use random available port
  })

  const address = server.address() as AddressInfo
  const baseUrl = `http://localhost:${address.port}`

  return baseUrl
}

export async function stopTestServer(): Promise<void> {
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close(err => {
        if (err) reject(err)
        else resolve()
      })
    })
    server = null
  }
}
