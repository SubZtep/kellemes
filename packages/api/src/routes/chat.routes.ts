import { createRoute, type OpenAPIHono, z } from "@hono/zod-openapi"
import { ChatRequestSchema, ChatResponseSchema } from "@kellemes/common"
import { ragService } from "@kellemes/rag"

const chatRoute = createRoute({
  method: "post",
  path: "/chat",
  summary: "Chat endpoint",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ChatRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: ChatResponseSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
    503: {
      description: "Service unavailable",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
})

export function registerChatRoutes(app: OpenAPIHono) {
  /**
   * POST /api/chat
   * Main chat endpoint with RAG support
   */
  app.openapi(chatRoute, async c => {
    try {
      // const { query, topK, useRAG = true }: ChatRequest = await c.req.json()
      // const { query, topK, useRAG = true }: ChatRequest = await c.req.valid("json")
      const { query, topK, useRAG = false } = await c.req.valid("json")

      let response: z.infer<typeof ChatResponseSchema>

      if (useRAG) {
        if (!ragService.isReady()) {
          return c.json(
            {
              error: "RAG service is not ready. Please run data ingestion first.",
            },
            503,
          )
        }
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

      return c.json(response, 200)
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
}
