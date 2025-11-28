import type { OpenAPIHono } from "@hono/zod-openapi"
import { registerChatRoutes } from "./chat.routes"
import { registerInfoRoutes } from "./info.routes"

export function registerRoutes(app: OpenAPIHono) {
  registerChatRoutes(app)
  registerInfoRoutes(app)
}
