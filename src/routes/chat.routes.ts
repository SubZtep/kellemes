import { Hono } from "hono"
import { ragService } from "../services/rag.service"
import type { ChatRequest, ChatResponse } from "../types"

const app = new Hono()

/**
 * POST /api/chat
 * Main chat endpoint with RAG support
 */
app.post("/chat", async c => {
  try {
    const { query, topK, useRAG = true }: ChatRequest = await c.req.json()

    if (!query || typeof query !== "string") {
      return c.json(
        {
          error: "Invalid request: query is required and must be a string",
        },
        400,
      )
    }

    if (!ragService.isReady()) {
      return c.json(
        {
          error: "RAG service is not ready. Please run data ingestion first.",
        },
        503,
      )
    }

    let response: ChatResponse

    if (useRAG) {
      const result = await ragService.generateResponse(query, topK)
      response = {
        response: result.response,
        sources: result.sources,
        model: "kellemes-rag",
      }
    } else {
      const directResponse = await ragService.generateDirectResponse(query)
      response = {
        response: directResponse,
        model: "kellemes",
      }
    }

    return c.json(response)
  } catch (error) {
    console.error("Error in chat endpoint:", error)
    return c.json(
      {
        error: "An error occurred while processing your request",
      },
      500,
    )
  }
})

/**
 * POST /api/retrieve
 * Retrieve relevant documents without generating a response
 */
app.post("/retrieve", async c => {
  try {
    const { query, topK } = await c.req.json()

    if (!query || typeof query !== "string") {
      return c.json(
        {
          error: "Invalid request: query is required and must be a string",
        },
        400,
      )
    }

    if (!ragService.isReady()) {
      return c.json(
        {
          error: "RAG service is not ready. Please run data ingestion first.",
        },
        503,
      )
    }

    const results = await ragService.retrieve(query, topK)

    return c.json({
      query,
      results,
      count: results.length,
    })
  } catch (error) {
    console.error("Error in retrieve endpoint:", error)
    return c.json(
      {
        error: "An error occurred while retrieving documents",
      },
      500,
    )
  }
})

/**
 * GET /api/stats
 * Get RAG system statistics
 */
app.get("/stats", c => {
  try {
    const stats = ragService.getStats()
    return c.json(stats)
  } catch (error) {
    console.error("Error in stats endpoint:", error)
    return c.json(
      {
        error: "An error occurred while fetching stats",
      },
      500,
    )
  }
})

export default app
