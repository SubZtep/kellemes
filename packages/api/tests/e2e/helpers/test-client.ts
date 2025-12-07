import { testFetch } from "./server-setup.js"

interface ChatResponse {
  response: string
  sources?: Array<{
    question: string
    answer: string
    score: number
  }>
  model: string
}

interface RetrieveResponse {
  query: string
  results: Array<{
    question: string
    answer: string
    score: number
  }>
  count: number
}

interface HealthResponse {
  status: string
  ollama: string
  rag: string
  timestamp: string
}

interface StatsResponse {
  totalDocuments: number
  modelName: string
  embeddingModel: string
}

export async function chatRequest(
  _baseUrl: string,
  query: string,
  options?: { topK?: number; useRAG?: boolean },
): Promise<ChatResponse> {
  const response = await testFetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      topK: options?.topK,
      useRAG: options?.useRAG ?? true,
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function retrieveRequest(_baseUrl: string, query: string, topK: number = 5): Promise<RetrieveResponse> {
  const response = await testFetch("/api/retrieve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      topK,
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function healthRequest(_baseUrl: string): Promise<HealthResponse> {
  const response = await testFetch("/health")

  // Health endpoint can return 200 (healthy) or 503 (degraded), both are valid
  if (response.status !== 200 && response.status !== 503) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function statsRequest(_baseUrl: string): Promise<StatsResponse> {
  const response = await testFetch("/api/stats")

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function rawRequest(_baseUrl: string, path: string, options?: RequestInit): Promise<Response> {
  return testFetch(path, options)
}
