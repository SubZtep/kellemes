import axios from "axios"
import "dotenv/config"
import type { OllamaChatRequest, OllamaChatResponse, OllamaEmbedRequest, OllamaEmbedResponse } from "../types"

export class OllamaService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL!
  }

  /**
   * Generate embeddings for a given text using Ollama
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const request: OllamaEmbedRequest = {
        model: process.env.EMBEDDING_MODEL!,
        prompt: text,
      }

      const response = await axios.post<OllamaEmbedResponse>(`${this.baseUrl}/api/embeddings`, request)

      return response.data.embedding
    } catch (error) {
      console.error("Error generating embedding:", error)
      throw new Error("Failed to generate embedding")
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = []

    for (const text of texts) {
      const embedding = await this.generateEmbedding(text)
      embeddings.push(embedding)
    }

    return embeddings
  }

  /**
   * Generate chat completion using Ollama
   */
  async chat(prompt: string, stream = false): Promise<string> {
    try {
      const request: OllamaChatRequest = {
        model: process.env.OLLAMA_MODEL!,
        prompt,
        stream,
      }

      const response = await axios.post<OllamaChatResponse>(`${this.baseUrl}/api/generate`, request)

      // Clean up response by removing any stop tokens that leaked through
      let cleanResponse = response.data.response
      const stopTokens = ["</|assistant|>", "<|assistant|>", "<|user|>", "<|system|>", "</s>"]

      for (const token of stopTokens) {
        cleanResponse = cleanResponse.replace(new RegExp(token, "g"), "")
      }

      return cleanResponse.trim()
    } catch (error) {
      console.error("Error generating chat response:", error)
      throw new Error("Failed to generate chat response")
    }
  }

  /**
   * Check if Ollama is running and models are available
   */
  async checkHealth(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/api/tags`)
      return true
    } catch (error) {
      console.error("Ollama health check failed:", error)
      return false
    }
  }
}

export const ollamaService = new OllamaService()
