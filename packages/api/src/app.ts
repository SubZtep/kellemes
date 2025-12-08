import { OpenAPIHono } from "@hono/zod-openapi"
import type { Session, User } from "../db/types"

export type AppEnv = {
  Variables: {
    user: User | null
    session: Session | null
  }
}

export type AppType = OpenAPIHono<AppEnv>

export const app: AppType = new OpenAPIHono<AppEnv>({ strict: true })

// 404 handler
app.notFound(c => c.json({ error: "Endpoint not found" }, 404))

// Error handler
app.onError((err, c) => {
  // Check if error has status property (HTTPException-like)
  if (err && typeof err === "object" && "status" in err && typeof err.status === "number") {
    const status = err.status
    let message = err.message || "Bad request"

    // OpenAPI validator errors might be in cause or have a specific structure
    // Check for Zod validation errors
    if (err.cause && Array.isArray(err.cause)) {
      const issues = err.cause as Array<{ path?: (string | number)[]; message?: string }>
      const fieldNames = issues
        .map(issue => {
          if (issue.path && issue.path.length > 0) {
            return issue.path.join(".")
          }
          return issue.message || "field"
        })
        .join(", ")
      message = fieldNames.length > 0 ? `Validation error: ${fieldNames}` : "Bad request"
    } else if (Array.isArray(message)) {
      // Handle if message itself is an array
      message = message.length > 0 ? message.join(", ") : "Bad request"
    } else if (typeof message === "string" && message.length === 0) {
      message = "Bad request"
    }

    // @ts-ignore
    return c.json({ error: message }, status)
  }
  console.error("Unhandled error:", err)
  return c.json({ error: "Internal server error" }, 500)
})
