import type { OpenAPIHono } from "@hono/zod-openapi"
import { registerChatRoutes } from "./chat.routes.js"
import { registerInfoRoutes } from "./info.routes.js"

export function registerRoutes(app: OpenAPIHono) {
  registerChatRoutes(app)
  registerInfoRoutes(app)
}
