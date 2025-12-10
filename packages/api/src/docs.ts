import type { OpenAPIHono } from "@hono/zod-openapi"
import { Scalar } from "@scalar/hono-api-reference"
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown"

export async function registerDocs(app: OpenAPIHono) {
  const packageJson = (await import("../../../package.json", { assert: { type: "json" } })).default
  const content = app.getOpenAPI31Document({
    openapi: "3.1.1",
    externalDocs: {
      url: "https://github.com/SubZtep/kellemes",
      description: "GitHub repository ",
    },
    info: {
      title: "keLLeMes API",
      version: packageJson.version,
    },
  })

  // OpenAPI specification
  app.doc("/openapi.json", () => content)

  // Interactive API documentation
  app.get(
    "/docs",
    Scalar({
      content: {
        openapi: "3.1.1",
      },
      url: "/openapi.json",
      pageTitle: "keLLeMes API Documentation",
      theme: "elysiajs",
      showDeveloperTools: "never",
      defaultHttpClient: {
        targetKey: "node",
        clientKey: "fetch",
      },
      darkMode: true,
      hideDownloadButton: true,
      forceDarkModeState: "dark",
      hideDarkModeToggle: true,
      telemetry: false,
      hideSearch: true,
      hideClientButton: true,
    }),
  )

  const markdown = await createMarkdownFromOpenApi(JSON.stringify(content))
  /**
   * Register a route to serve the Markdown to LLMs.
   * @see https://llmstxt.org/
   */
  app.get("/llms.txt", c => c.text(markdown))
}
