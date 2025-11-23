import { OpenAPIHono } from "@hono/zod-openapi"

export const app = new OpenAPIHono({ strict: true })

// 404 handler
app.notFound(c => c.json({ error: "🍄But our princess is in another castle!" }, 404))

// Error handler
app.onError((err, c) => {
  console.error("Unhandled error:", err)
  return c.json({ error: "Internal server error" }, 500)
})
