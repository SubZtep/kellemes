import "dotenv/config"
import { ragService } from "@kellemes/rag"
import { app } from "../../../src/app.js"
import { registerDocs } from "../../../src/docs.js"
import { registerMiddleware } from "../../../src/middlewares.js"
import { registerRoutes } from "../../../src/routes/index.js"

let initialized = false

export async function startTestServer(): Promise<string> {
  if (!initialized) {
    // Register middleware and routes (same as production)
    registerMiddleware(app)
    registerRoutes(app)
    await registerDocs(app)

    // Initialize RAG service
    await ragService.initialize()
    initialized = true
  }

  // Return a dummy baseUrl - we'll use app.fetch directly
  return "http://localhost"
}

export async function stopTestServer(): Promise<void> {
  // Cleanup if needed (RAG service cleanup, etc.)
  initialized = false
}

/**
 * Helper to make requests using app.fetch directly
 * This avoids starting an actual HTTP server
 */
export async function testFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = path.startsWith("http") ? path : `http://localhost${path}`
  return app.fetch(new Request(url, init))
}
