/**
 * E2E tests for health and stats endpoints
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { startTestServer, stopTestServer } from "./helpers/server-setup"
import { healthRequest, rawRequest, statsRequest } from "./helpers/test-client"

let baseUrl: string

beforeAll(async () => {
  baseUrl = await startTestServer()
})

afterAll(async () => {
  await stopTestServer()
})

describe("GET /health", () => {
  it("should return health status", async () => {
    const result = await healthRequest(baseUrl)

    expect(result).toHaveProperty("status")
    expect(result).toHaveProperty("ollama")
    expect(result).toHaveProperty("rag")
    expect(result).toHaveProperty("timestamp")
  })

  it("should have valid status values", async () => {
    const result = await healthRequest(baseUrl)

    expect(["healthy", "degraded"]).toContain(result.status)
    expect(["connected", "disconnected"]).toContain(result.ollama)
    expect(["ready", "not initialized"]).toContain(result.rag)
  })

  it("should return valid ISO timestamp", async () => {
    const result = await healthRequest(baseUrl)

    expect(result.timestamp).toBeTruthy()
    const timestamp = new Date(result.timestamp)
    expect(timestamp.toString()).not.toBe("Invalid Date")
  })

  it("should return 200 when healthy", async () => {
    const response = await rawRequest(baseUrl, "/health")
    const result = (await response.json()) as Record<string, unknown>

    if (result.status === "healthy") {
      expect(response.status).toBe(200)
    }
  })

  it("should return 503 when degraded", async () => {
    const response = await rawRequest(baseUrl, "/health")
    const result = (await response.json()) as Record<string, unknown>

    if (result.status === "degraded") {
      expect(response.status).toBe(503)
    }
  })
})

describe("GET /api/stats", () => {
  it("should return RAG system statistics", async () => {
    const result = await statsRequest(baseUrl)

    expect(result).toHaveProperty("totalDocuments")
    expect(result).toHaveProperty("modelName")
    expect(result).toHaveProperty("embeddingModel")
  })

  it("should have valid statistics values", async () => {
    const result = await statsRequest(baseUrl)

    expect(typeof result.totalDocuments).toBe("number")
    expect(result.totalDocuments).toBeGreaterThanOrEqual(0)
    expect(typeof result.modelName).toBe("string")
    expect(typeof result.embeddingModel).toBe("string")
    expect(result.modelName.length).toBeGreaterThan(0)
    expect(result.embeddingModel.length).toBeGreaterThan(0)
  })

  it("should return consistent stats on multiple calls", async () => {
    const result1 = await statsRequest(baseUrl)
    const result2 = await statsRequest(baseUrl)

    expect(result1.totalDocuments).toBe(result2.totalDocuments)
    expect(result1.modelName).toBe(result2.modelName)
    expect(result1.embeddingModel).toBe(result2.embeddingModel)
  })
})

describe("GET / - Root endpoint", () => {
  it("should return API information", async () => {
    const response = await rawRequest(baseUrl, "/")
    const result = (await response.json()) as Record<string, unknown>

    expect(result).toHaveProperty("name")
    expect(result).toHaveProperty("version")
    expect(result).toHaveProperty("endpoints")
    expect(result.name).toBe("keLLeMes RAG API")
  })

  it("should list all available endpoints", async () => {
    const response = await rawRequest(baseUrl, "/")
    const result = (await response.json()) as Record<string, any>

    expect(result.endpoints).toHaveProperty("chat")
    expect(result.endpoints).toHaveProperty("retrieve")
    expect(result.endpoints).toHaveProperty("stats")
    expect(result.endpoints).toHaveProperty("health")
    expect(result.endpoints.chat).toBe("POST /api/chat")
    expect(result.endpoints.retrieve).toBe("POST /api/retrieve")
    expect(result.endpoints.stats).toBe("GET /api/stats")
    expect(result.endpoints.health).toBe("GET /health")
  })
})
