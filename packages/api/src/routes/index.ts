import { OpenAPIHono } from "@hono/zod-openapi"
import type { AppType } from "../app.js"
import { registerAuthRoutes } from "./auth.routes.js"
// import { cors } from "hono/cors"
// import { auth } from "../lib/auth"
import { registerChatRoutes } from "./chat.routes.js"
import { registerInfoRoutes } from "./info.routes.js"

export function registerRoutes(app: AppType) {
  const apiApp = new OpenAPIHono()

  // Mount chat routes under /api
  registerChatRoutes(apiApp)
  app.route("/api", apiApp)

  // Info routes at root level
  registerInfoRoutes(app)
  registerAuthRoutes(app)
}
