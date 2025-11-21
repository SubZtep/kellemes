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
  baseUrl: string,
  query: string,
  options?: { topK?: number; useRAG?: boolean },
): Promise<ChatResponse> {
  const response = await fetch(`${baseUrl}/api/chat`, {
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

export async function retrieveRequest(baseUrl: string, query: string, topK: number = 5): Promise<RetrieveResponse> {
  const response = await fetch(`${baseUrl}/api/retrieve`, {
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

export async function healthRequest(baseUrl: string): Promise<HealthResponse> {
  const response = await fetch(`${baseUrl}/health`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function statsRequest(baseUrl: string): Promise<StatsResponse> {
  const response = await fetch(`${baseUrl}/api/stats`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function rawRequest(baseUrl: string, path: string, options?: RequestInit): Promise<Response> {
  return fetch(`${baseUrl}${path}`, options)
}
