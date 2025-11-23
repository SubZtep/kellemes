import type { OpenAPIHono } from "@hono/zod-openapi"
import { Scalar } from "@scalar/hono-api-reference"
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown"

export async function registerDocs(app: OpenAPIHono) {
  const content = app.getOpenAPI31Document({
    openapi: "3.0.0",
    externalDocs: {
      url: "https://github.com/SubZtep/kellemes",
      description: "GitHub repository ",
    },
    info: {
      title: "keLLeMes API",
      version: "1.0.0",
    },
  })

  // OpenAPI specification
  app.doc("/openapi.json", () => content)

  // Interactive API documentation
  app.get(
    "/docs",
    Scalar({
      url: "/openapi.json",
      pageTitle: "keLLeMes API Documentation",
      theme: "elysiajs",
      showDeveloperTools: "never",
      defaultHttpClient: {
        targetKey: "node",
        clientKey: "fetch",
      },
      darkMode: true,
      forceDarkModeState: "dark",
      hideDarkModeToggle: true,
      telemetry: false,
    }),
  )

  const markdown = await createMarkdownFromOpenApi(JSON.stringify(content))
  /**
   * Register a route to serve the Markdown to LLMs.
   * @see https://llmstxt.org/
   */
  app.get("/llms.txt", c => c.text(markdown))
}
