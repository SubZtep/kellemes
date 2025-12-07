import { z } from "@hono/zod-openapi"

// Health response schema
export const HealthSchema = z.object({
  status: z.enum(["healthy", "degraded"]),
  ollama: z.enum(["connected", "disconnected"]),
  rag: z.enum(["ready", "not initialized"]),
  timestamp: z.string().openapi({ description: "Server timestamp", example: "2025-11-23T16:07:53.669Z" }),
})
