/**
 * E2E tests for error handling and edge cases
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { startTestServer, stopTestServer } from "./helpers/server-setup"
import { rawRequest } from "./helpers/test-client"

let baseUrl: string

beforeAll(async () => {
  baseUrl = await startTestServer()
})

afterAll(async () => {
  await stopTestServer()
})

describe("POST /api/chat - Error handling", () => {
  it("should return 400 when query is missing", async () => {
    const response = await rawRequest(baseUrl, "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })

    expect(response.status).toBe(400)
    const result = (await response.json()) as Record<string, unknown>
    expect(result).toHaveProperty("error")
    expect(result.error).toContain("query")
  })

  it("should return 400 when query is not a string", async () => {
    const response = await rawRequest(baseUrl, "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: 123 }),
    })

    expect(response.status).toBe(400)
    const result = await response.json()
    expect(result).toHaveProperty("error")
  })

  it("should return 400 when query is null", async () => {
    const response = await rawRequest(baseUrl, "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: null }),
    })

    expect(response.status).toBe(400)
    const result = await response.json()
    expect(result).toHaveProperty("error")
  })

  it("should return 400 when query is empty string", async () => {
    const response = await rawRequest(baseUrl, "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "" }),
    })

    expect(response.status).toBe(400)
    const result = await response.json()
    expect(result).toHaveProperty("error")
  })

  it("should handle malformed JSON", async () => {
    const response = await rawRequest(baseUrl, "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{invalid json",
    })

    expect(response.status).toBeGreaterThanOrEqual(400)
  })
})

describe("POST /api/retrieve - Error handling", () => {
  it("should return 400 when query is missing", async () => {
    const response = await rawRequest(baseUrl, "/api/retrieve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })

    expect(response.status).toBe(400)
    const result = (await response.json()) as Record<string, unknown>
    expect(result).toHaveProperty("error")
    expect(result.error).toContain("query")
  })

  it("should return 400 when query is not a string", async () => {
    const response = await rawRequest(baseUrl, "/api/retrieve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: 123 }),
    })

    expect(response.status).toBe(400)
    const result = await response.json()
    expect(result).toHaveProperty("error")
  })

  it("should return 400 when query is empty", async () => {
    const response = await rawRequest(baseUrl, "/api/retrieve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "" }),
    })

    expect(response.status).toBe(400)
    const result = await response.json()
    expect(result).toHaveProperty("error")
  })
})

describe("404 Not Found handling", () => {
  it("should return 404 for non-existent endpoint", async () => {
    const response = await rawRequest(baseUrl, "/api/nonexistent")

    expect(response.status).toBe(404)
    const result = (await response.json()) as Record<string, unknown>
    expect(result).toHaveProperty("error")
    expect(result.error).toContain("not found")
  })

  it("should return 404 for random path", async () => {
    const response = await rawRequest(baseUrl, "/random/path/here")

    expect(response.status).toBe(404)
    const result = await response.json()
    expect(result).toHaveProperty("error")
  })

  it("should return 404 JSON response", async () => {
    const response = await rawRequest(baseUrl, "/does-not-exist")
    const result = await response.json()

    expect(response.status).toBe(404)
    expect(result).toHaveProperty("error")
  })
})

describe("HTTP Method handling", () => {
  it("should reject GET request to /api/chat", async () => {
    const response = await rawRequest(baseUrl, "/api/chat", {
      method: "GET",
    })

    expect(response.status).toBeGreaterThanOrEqual(400)
  })

  it("should reject GET request to /api/retrieve", async () => {
    const response = await rawRequest(baseUrl, "/api/retrieve", {
      method: "GET",
    })

    expect(response.status).toBeGreaterThanOrEqual(400)
  })

  it("should accept POST request to /api/chat", async () => {
    const response = await rawRequest(baseUrl, "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "test" }),
    })

    // Should not be 405 Method Not Allowed
    expect(response.status).not.toBe(405)
  })
})

describe("CORS handling", () => {
  it("should include CORS headers", async () => {
    const response = await rawRequest(baseUrl, "/health")

    expect(response.headers.has("access-control-allow-origin")).toBe(true)
  })

  it("should handle OPTIONS request", async () => {
    const response = await rawRequest(baseUrl, "/api/chat", {
      method: "OPTIONS",
    })

    expect([200, 204]).toContain(response.status)
  })
})

describe("Content-Type handling", () => {
  it("should handle request without Content-Type header", async () => {
    const response = await rawRequest(baseUrl, "/api/chat", {
      method: "POST",
      body: JSON.stringify({ query: "test" }),
    })

    // Should still attempt to process
    expect(response.status).toBeLessThan(500)
  })

  it("should handle request with wrong Content-Type", async () => {
    const response = await rawRequest(baseUrl, "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ query: "test" }),
    })

    // Should still attempt to process
    expect(response.status).toBeLessThan(500)
  })
})
