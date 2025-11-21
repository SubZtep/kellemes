/**
 * E2E tests for /api/chat endpoint
 * Based on examples/chat-client.ts
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { startTestServer, stopTestServer } from "./helpers/server-setup"
import { chatRequest } from "./helpers/test-client"

let baseUrl: string

beforeAll(async () => {
  baseUrl = await startTestServer()
})

afterAll(async () => {
  await stopTestServer()
})

describe("POST /api/chat - RAG enabled", () => {
  it("should respond to casual greeting", async () => {
    const result = await chatRequest(baseUrl, "You from around here?")

    expect(result).toHaveProperty("response")
    expect(result).toHaveProperty("model")
    expect(result.response).toBeTruthy()
    expect(typeof result.response).toBe("string")
    expect(result.model).toBe("kellemes-rag")
  })

  it("should return sources for relevant queries", async () => {
    const result = await chatRequest(baseUrl, "Any favorite movie?")

    expect(result).toHaveProperty("response")
    expect(result).toHaveProperty("sources")
    expect(result.response).toBeTruthy()

    if (result.sources) {
      expect(Array.isArray(result.sources)).toBe(true)
      expect(result.sources.length).toBeGreaterThan(0)

      // Validate source structure
      const firstSource = result.sources[0]
      expect(firstSource).toHaveProperty("question")
      expect(firstSource).toHaveProperty("answer")
      expect(firstSource).toHaveProperty("score")
      expect(typeof firstSource.score).toBe("number")
      expect(firstSource.score).toBeGreaterThan(0)
      expect(firstSource.score).toBeLessThanOrEqual(1)
    }
  })

  it("should handle coffee date query", async () => {
    const result = await chatRequest(baseUrl, "I'm down for a coffee date there.")

    expect(result).toHaveProperty("response")
    expect(result.model).toBe("kellemes-rag")
    expect(result.response).toBeTruthy()
  })

  it("should respect topK parameter", async () => {
    const topK = 3
    const result = await chatRequest(baseUrl, "Any favorite movie?", { topK })

    if (result.sources) {
      expect(result.sources.length).toBeLessThanOrEqual(topK)
    }
  })

  it("should handle weekend plans query", async () => {
    const result = await chatRequest(baseUrl, "So, what's your favorite way to spend a weekend?")

    expect(result).toHaveProperty("response")
    expect(result.response).toBeTruthy()
    expect(result.model).toBe("kellemes-rag")
  })
})

describe("POST /api/chat - RAG disabled", () => {
  it("should respond without RAG when useRAG is false", async () => {
    const result = await chatRequest(baseUrl, "So, what's your favorite way to spend a weekend?", { useRAG: false })

    expect(result).toHaveProperty("response")
    expect(result.response).toBeTruthy()
    expect(result.model).toBe("kellemes")
    expect(result.sources).toBeUndefined()
  })

  it("should work for casual queries without RAG", async () => {
    const result = await chatRequest(baseUrl, "Hello there!", { useRAG: false })

    expect(result).toHaveProperty("response")
    expect(result.response).toBeTruthy()
    expect(result.model).toBe("kellemes")
    expect(result.sources).toBeUndefined()
  })
})

describe("POST /api/chat - Response structure", () => {
  it("should always include required fields", async () => {
    const result = await chatRequest(baseUrl, "Test query")

    expect(result).toHaveProperty("response")
    expect(result).toHaveProperty("model")
    expect(typeof result.response).toBe("string")
    expect(typeof result.model).toBe("string")
  })

  it("should have sources ordered by similarity score", async () => {
    const result = await chatRequest(baseUrl, "Any favorite movie?", { topK: 5 })

    if (result.sources && result.sources.length > 1) {
      for (let i = 0; i < result.sources.length - 1; i++) {
        expect(result.sources[i].score).toBeGreaterThanOrEqual(result.sources[i + 1].score)
      }
    }
  })
})
