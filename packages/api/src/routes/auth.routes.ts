import type { OpenAPIHono } from "@hono/zod-openapi"
import { auth } from "../lib/auth"

export function registerAuthRoutes(app: OpenAPIHono) {
  // Better Auth routes
  // app.on(["POST", "GET"], "/api/auth/*", c => auth.handler(c.req.raw))
  app.on(["POST", "GET"], "/api/auth/*", c => {
    return auth.handler(c.req.raw)
  })

  app.get("/session", c => {
    // Remove the generic type parameter to fix the type error
    // @ts-ignore
    const session = c.get("session")
    // @ts-ignore
    const user = c.get("user")

    if (!user) return c.body(null, 401)

    return c.json({
      session,
      user,
    })
  })
}
