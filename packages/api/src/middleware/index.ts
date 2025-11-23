import type { OpenAPIHono } from "@hono/zod-openapi"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { trimTrailingSlash } from "hono/trailing-slash"

export function registerMiddleware(app: OpenAPIHono) {
  app.use("*", cors())
  app.use("*", logger())
  app.use("*", trimTrailingSlash())
}
