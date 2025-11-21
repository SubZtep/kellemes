/**
 * E2E tests for /api/retrieve endpoint
 * Based on examples/retrieve-example.ts
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { startTestServer, stopTestServer } from "./helpers/server-setup"
import { retrieveRequest } from "./helpers/test-client"

let baseUrl: string

beforeAll(async () => {
  baseUrl = await startTestServer()
})

afterAll(async () => {
  await stopTestServer()
})

describe("POST /api/retrieve", () => {
  it("should retrieve relevant documents for movie query", async () => {
    const result = await retrieveRequest(baseUrl, "Any favorite movie?", 5)

    expect(result).toHaveProperty("query")
    expect(result).toHaveProperty("results")
    expect(result).toHaveProperty("count")
    expect(result.query).toBe("Any favorite movie?")
    expect(Array.isArray(result.results)).toBe(true)
    expect(result.count).toBe(result.results.length)
    expect(result.count).toBeGreaterThan(0)
    expect(result.count).toBeLessThanOrEqual(5)
  })

  it("should retrieve documents for coffee date query", async () => {
    const result = await retrieveRequest(baseUrl, "I'm down for a coffee date there.", 3)

    expect(result.query).toBe("I'm down for a coffee date there.")
    expect(result.count).toBeLessThanOrEqual(3)
    expect(result.results.length).toBe(result.count)
  })

  it("should retrieve documents for weekend plans query", async () => {
    const result = await retrieveRequest(baseUrl, "So, what's your favorite way to spend a weekend?", 5)

    expect(result.query).toBe("So, what's your favorite way to spend a weekend?")
    expect(result.count).toBeGreaterThan(0)
    expect(result.results.length).toBe(result.count)
  })

  it("should respect topK parameter", async () => {
    const topK = 3
    const result = await retrieveRequest(baseUrl, "Any favorite movie?", topK)

    expect(result.results.length).toBeLessThanOrEqual(topK)
    expect(result.count).toBeLessThanOrEqual(topK)
  })

  it("should return results sorted by similarity score (descending)", async () => {
    const result = await retrieveRequest(baseUrl, "Any favorite movie?", 5)

    if (result.results.length > 1) {
      for (let i = 0; i < result.results.length - 1; i++) {
        expect(result.results[i]!.score).toBeGreaterThanOrEqual(result.results[i + 1]!.score)
      }
    }
  })
})

describe("POST /api/retrieve - Result structure", () => {
  it("should return properly structured results", async () => {
    const result = await retrieveRequest(baseUrl, "Any favorite movie?", 5)

    expect(result.results.length).toBeGreaterThan(0)

    result.results.forEach(item => {
      expect(item).toHaveProperty("question")
      expect(item).toHaveProperty("answer")
      expect(item).toHaveProperty("score")
      expect(typeof item.question).toBe("string")
      expect(typeof item.answer).toBe("string")
      expect(typeof item.score).toBe("number")
      expect(item.question.length).toBeGreaterThan(0)
      expect(item.answer.length).toBeGreaterThan(0)
    })
  })

  it("should return similarity scores between 0 and 1", async () => {
    const result = await retrieveRequest(baseUrl, "Any favorite movie?", 5)

    result.results.forEach(item => {
      expect(item.score).toBeGreaterThan(0)
      expect(item.score).toBeLessThanOrEqual(1)
    })
  })

  it("should include count matching results length", async () => {
    const result = await retrieveRequest(baseUrl, "Any favorite movie?", 5)

    expect(result.count).toBe(result.results.length)
  })
})

describe("POST /api/retrieve - Different topK values", () => {
  it("should handle topK=1", async () => {
    const result = await retrieveRequest(baseUrl, "Any favorite movie?", 1)

    expect(result.results.length).toBe(1)
    expect(result.count).toBe(1)
  })

  it("should handle topK=10", async () => {
    const result = await retrieveRequest(baseUrl, "Any favorite movie?", 10)

    expect(result.results.length).toBeLessThanOrEqual(10)
    expect(result.count).toBe(result.results.length)
  })

  it("should default to reasonable topK when not specified", async () => {
    const result = await retrieveRequest(baseUrl, "Any favorite movie?")

    expect(result.results.length).toBeGreaterThan(0)
    expect(result.count).toBe(result.results.length)
  })
})
