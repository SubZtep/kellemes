import type { AppType } from "../app"
import { auth, getSessionByToken } from "../lib/auth"

export function registerAuthRoutes(app: AppType) {
  app.on(["POST", "GET"], "/api/auth/*", c => {
    return auth.handler(c.req.raw)
  })

  // Session endpoint that accepts Bearer token for CLI/API clients
  app.get("/session", async c => {
    // First try middleware session (cookie-based)
    let session = c.get("session")
    let user = c.get("user")

    // If no cookie session, try Bearer token
    if (!session) {
      const authHeader = c.req.header("Authorization")
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7)
        const result = await getSessionByToken(token)
        if (result) {
          session = result.session
          user = result.user
        }
      }
    }

    if (!user || !session) return c.body(null, 401)

    return c.json({
      session,
      user,
    })
  })
}
