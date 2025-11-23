import type { OpenAPIHono } from "@hono/zod-openapi"
import { Scalar } from "@scalar/hono-api-reference"

export function registerDocs(app: OpenAPIHono) {
  // OpenAPI specification
  app.doc("/openapi.json", c => ({
    openapi: "3.0.0",
    externalDocs: {
      url: "https://github.com/SubZtep/kellemes",
      description: "GitHub repository ",
    },
    servers: [
      {
        url: new URL(c.req.url).origin,
        description: "Current environment",
      },
    ],
    info: {
      title: "keLLeMes API",
      version: "1.0.0",
    },
  }))

  // Interactive API documentation
  app.get(
    "/docs",
    Scalar({
      url: "/openapi.json",
      theme: "elysiajs",
      showDeveloperTools: "never",
      pageTitle: "keLLeMes API Documentation",
      darkMode: true,
      defaultHttpClient: {
        targetKey: "node",
        clientKey: "fetch",
      },
      forceDarkModeState: "dark",
      hideDarkModeToggle: true,
      telemetry: false,
    }),
  )
}
