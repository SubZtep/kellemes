export interface QAPair {
  question: string
  answer: string
}

export interface EmbeddedQAPair extends QAPair {
  id: string
  embedding: number[]
}

export interface SearchResult {
  question: string
  answer: string
  score: number
}

export interface ChatRequest {
  query: string
  topK?: number
  useRAG?: boolean
}

export interface ChatResponse {
  response: string
  sources?: SearchResult[]
  model: string
}

export interface OllamaEmbedRequest {
  model: string
  prompt: string
}

export interface OllamaEmbedResponse {
  embedding: number[]
}

export interface OllamaChatRequest {
  model: string
  prompt: string
  stream?: boolean
}

export interface OllamaChatResponse {
  response: string
  model: string
  created_at: string
  done: boolean
}
