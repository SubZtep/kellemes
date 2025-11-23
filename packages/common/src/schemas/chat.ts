import { z } from "@hono/zod-openapi"

// Search result schema (used in chat responses)
export const SearchResultSchema = z.object({
  question: z
    .string()
    .openapi({ description: "The question that was asked", example: "What is the capital of France?" }),
  answer: z.string().openapi({ description: "The answer to the question", example: "The capital of France is Paris." }),
  score: z.number().openapi({ description: "The score of the answer", example: 0.95 }),
})

// Chat request schema
export const ChatRequestSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Query is required")
    .openapi({ description: "The query to send to the chat endpoint", example: "What is the capital of France?" }),
  topK: z.number().optional().openapi({ description: "The number of top results to return", example: 3 }),
  useRAG: z.boolean().optional().openapi({ description: "Whether to use RAG or not", example: true }),
})

// Chat response schema
export const ChatResponseSchema = z.object({
  response: z
    .string()
    .openapi({ description: "The response from the chat endpoint", example: "The capital of France is Paris." }),
  sources: z
    .array(SearchResultSchema)
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
