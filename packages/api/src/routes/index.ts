import { OpenAPIHono } from "@hono/zod-openapi"
import { registerAuthRoutes } from "./auth.routes"
// import { cors } from "hono/cors"
// import { auth } from "../lib/auth"
import { registerChatRoutes } from "./chat.routes"
import { registerInfoRoutes } from "./info.routes"

export function registerRoutes(app: OpenAPIHono) {
  const apiApp = new OpenAPIHono()

  // app.use(
  //   "/api/auth/*", // or replace with "*" to enable cors for all routes
  //   cors({
  //     origin: `http://localhost:${process.env.API_PORT}`,
  //     allowHeaders: ["Content-Type", "Authorization"],
  //     allowMethods: ["POST", "GET", "OPTIONS"],
  //     exposeHeaders: ["Content-Length"],
  //     maxAge: 600,
  //     credentials: true,
  //   }),
  // )

  // Mount chat routes under /api
  registerChatRoutes(apiApp)
  app.route("/api", apiApp)

  // Info routes at root level
  registerInfoRoutes(app)
  registerAuthRoutes(app)
}
