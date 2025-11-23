import { createRoute, type OpenAPIHono, z } from "@hono/zod-openapi"
// import type { ChatRequest, ChatResponse } from "@kellemes/common"
import { ragService } from "@kellemes/rag"

const ChatRequestSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Query is required")
    .openapi({ description: "The query to send to the chat endpoint", example: "What is the capital of France?" }),
  topK: z.number().optional().openapi({ description: "The number of top results to return", example: 3 }),
  useRAG: z.boolean().optional().openapi({ description: "Whether to use RAG or not", example: true }),
})

const ChatResponseSchema = z.object({
  response: z
    .string()
    .openapi({ description: "The response from the chat endpoint", example: "The capital of France is Paris." }),
  sources: z
    .array(
      z.object({
        question: z
          .string()
          .openapi({ description: "The question that was asked", example: "What is the capital of France?" }),
        answer: z
          .string()
          .openapi({ description: "The answer to the question", example: "The capital of France is Paris." }),
        score: z.number().openapi({ description: "The score of the answer", example: 0.95 }),
      }),
    )
    .optional()
    .openapi({
      description: "The sources that were used to answer the question",
      example: [{ question: "What is the capital of France?", answer: "The capital of France is Paris.", score: 0.95 }],
    }),
  model: z
    .string()
    .optional()
    .openapi({ description: "The model that was used to answer the question", example: "kellemes-rag" }),
})

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

      // if (!query || typeof query !== "string") {
      //   return c.json(
      //     {
      //       error: "Invalid request: query is required and must be a string",
      //     },
      //     400,
      //   )
      // }

      if (!ragService.isReady()) {
        return c.json(
          {
            error: "RAG service is not ready. Please run data ingestion first.",
          },
          503,
        )
      }

      let response: z.infer<typeof ChatResponseSchema>

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
