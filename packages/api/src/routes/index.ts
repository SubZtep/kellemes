import { OpenAPIHono } from "@hono/zod-openapi"
import { registerChatRoutes } from "./chat.routes.js"
import { registerInfoRoutes } from "./info.routes.js"

export function registerRoutes(app: OpenAPIHono) {
  // Mount chat routes under /api
  const apiApp = new OpenAPIHono()
  registerChatRoutes(apiApp)
  app.route("/api", apiApp)

  // Info routes at root level
  registerInfoRoutes(app)
}
