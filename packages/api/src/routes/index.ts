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

  // // Better Auth routes
  // // app.on(["POST", "GET"], "/api/auth/*", c => auth.handler(c.req.raw))
  // app.on(["POST", "GET"], "/api/auth/*", c => {
  //   return auth.handler(c.req.raw)
  // })

  // app.get("/session", c => {
  //   // Remove the generic type parameter to fix the type error
  //   // @ts-ignore
  //   const session = c.get("session")
  //   // @ts-ignore
  //   const user = c.get("user")

  //   if (!user) return c.body(null, 401)

  //   return c.json({
  //     session,
  //     user,
  //   })
  // })
}
