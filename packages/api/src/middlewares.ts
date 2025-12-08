import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { trimTrailingSlash } from "hono/trailing-slash"
import type { AppType } from "./app"
// import { auth } from "./lib/auth"

export function registerMiddleware(app: AppType) {
  app.use("*", async (_c, next) => {
    // const session = await auth.api.getSession({ headers: c.req.raw.headers })
    // if (!session) {
    //   c.set("user", null)
    //   c.set("session", null)
    //   await next()
    //   return
    // }
    // c.set("user", session.user)
    // c.set("session", session.session)
    await next()
  })

  app.use(
    "*",
    cors({
      // origin: process.env.API_URL,
      origin: "*",
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )

  // app.use("*", cors())
  app.use("*", logger())
  app.use("*", trimTrailingSlash())
}
