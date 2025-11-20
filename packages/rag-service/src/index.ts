import { ollamaService } from "@kellemes/ollama-service"
import type { EmbeddedQAPair, QAPair, SearchResult } from "@kellemes/types"
import { VectorService } from "@kellemes/vector-service"
import "dotenv/config"
import * as fs from "node:fs/promises"
import { join } from "node:path"

/**
 * RAG (Retrieval-Augmented Generation) Service
 * Handles ingestion, retrieval, and augmented generation
 */
export class RAGService {
  private vectorService: VectorService

  constructor() {
    this.vectorService = new VectorService(join(process.env.DATA_DIR!, "vectors/qa_vectors.json"))
  }

  /**
   * Initialize the RAG service by loading or creating the vector database
   */
  async initialize(): Promise<void> {
    try {
      await this.vectorService.load()

      if (!this.vectorService.isInitialized()) {
        console.log("Vector database empty. Run ingestion to populate it.")
      } else {
        console.log(`RAG service initialized with ${this.vectorService.getCount()} documents`)
      }
    } catch (error) {
      console.error("Error initializing RAG service:", error)
      throw error
    }
  }

  /**
   * Ingest Q&A data and create embeddings
   */
  async ingestData(): Promise<void> {
    console.log("Starting data ingestion...")

    try {
      // Load Q&A data
      const data = await fs.readFile(join(process.env.DATA_DIR!, "training/qa.json"), "utf-8")
      const qaPairs: QAPair[] = JSON.parse(data)

      console.log(`Loaded ${qaPairs.length} Q&A pairs`)

      // Clear existing vectors
      this.vectorService.clear()

      // Generate embeddings for each Q&A pair
      console.log("Generating embeddings...")
      const embeddedPairs: EmbeddedQAPair[] = []

      for (let i = 0; i < qaPairs.length; i++) {
        if (i % 50 === 0) {
          console.log(`Processing ${i + 1}/${qaPairs.length}...`)
        }

        const qa = qaPairs[i]

        if (!qa || !qa.question || !qa.answer) {
          console.warn(`Skipping Q&A pair ${i} because it is missing question or answer.`)
          continue
        }

        // Combine question and answer for richer embeddings
        const text = `Question: ${qa.question}\nAnswer: ${qa.answer}`
        const embedding = await ollamaService.generateEmbedding(text)

        embeddedPairs.push({
          id: `qa_${i}`,
          question: qa.question,
          answer: qa.answer,
          embedding,
        })
      }

      // Add all vectors to the database
      this.vectorService.addVectors(embeddedPairs)

      // Save to disk
      await this.vectorService.save()

      console.log(`✓ Successfully ingested ${embeddedPairs.length} documents`)
    } catch (error) {
      console.error("Error during data ingestion:", error)
      throw error
    }
  }

  /**
   * Retrieve relevant documents for a query
   */
  async retrieve(query: string, topK?: number): Promise<SearchResult[]> {
    const k = topK || Number(process.env.TOP_K_RESULTS)

    // Generate embedding for the query
    const queryEmbedding = await ollamaService.generateEmbedding(query)

    // Search for similar documents
    const results = this.vectorService.search(queryEmbedding, k, Number(process.env.SIMILARITY_THRESHOLD))

    return results
  }

  /**
   * Check if a query is medical/health-related
   */
  private isMedicalQuery(query: string, sources: SearchResult[]): boolean {
    // If no relevant sources found or all scores are very low, likely not medical
    if (sources.length === 0 || !sources[0] || sources[0].score < 0.5) {
      return false
    }

    // Check for obvious non-medical keywords
    const nonMedicalKeywords =
      /\b(nvidia|gpu|computer|gaming|software|programming|code|app|phone|company|business|brand|product|movie|game|sports|football|basketball|music|song|video|youtube|tiktok|instagram|facebook|twitter)\b/i

    if (nonMedicalKeywords.test(query)) {
      return false
    }

    return true
  }

  /**
   * Generate a response using RAG
   */
  async generateResponse(
    query: string,
    topK?: number,
  ): Promise<{
    response: string
    sources: SearchResult[]
  }> {
    // Check if query is casual/conversational (short greetings, etc.)
    const casualPatterns =
      /^(hi|hey|hello|howdy|sup|what's up|how are you|good morning|good afternoon|good evening|thanks|thank you|bye|goodbye)\??!?$/i
    const isCasual = query.trim().length < 30 && casualPatterns.test(query.trim())

    if (isCasual) {
      // For casual queries, use base model without RAG context
      const response = await ollamaService.chat(query)
      return { response, sources: [] }
    }

    // Retrieve relevant context
    const sources = await this.retrieve(query, topK)

    // Check if this is actually a medical query
    if (!this.isMedicalQuery(query, sources)) {
      // Non-medical query - politely redirect
      const redirectPrompt = `You are XpLLMoro, a friendly AI companion for children in medical settings.

The child asked: "${query}"

This question is not about medical topics or hospital care. Politely let them know that you're specifically designed to help with medical questions, procedures, and hospital experiences. Be friendly and encouraging, and invite them to ask any medical or health-related questions they might have.

Response:`

      const response = await ollamaService.chat(redirectPrompt)
      return { response, sources: [] }
    }

    if (sources.length === 0) {
      // No relevant context found, use base model
      const response = await ollamaService.chat(query)
      return { response, sources: [] }
    }

    // Build augmented prompt with retrieved context
    const context = sources.map((s, i) => `${i + 1}. Q: ${s.question}\n   A: ${s.answer}`).join("\n\n")

    const augmentedPrompt = `You are XpLLMoro, a friendly AI companion for children in medical settings. Answer the child's question using ONLY the relevant information provided below if it applies. Always maintain a warm, supportive, and age-appropriate tone.

IMPORTANT RULES:
- ONLY use the reference information if it directly relates to the question
- Do NOT make assumptions about the child's situation (e.g., don't assume they have an operation scheduled)
- If the question is casual or conversational (like "hey", "how are you"), respond naturally without medical context
- Be helpful and friendly, but stick to what is actually asked

Reference Information (use only if relevant):
${context}

Child's Question: ${query}

Response:`

    // Generate response with augmented context
    const response = await ollamaService.chat(augmentedPrompt)

    return { response, sources }
  }

  /**
   * Generate a response without RAG (direct model call)
   */
  async generateDirectResponse(query: string): Promise<string> {
    return await ollamaService.chat(query)
  }

  /**
   * Check if the RAG service is ready
   */
  isReady(): boolean {
    return this.vectorService.isInitialized()
  }

  /**
   * Get statistics about the RAG system
   */
  getStats() {
    return {
      totalDocuments: this.vectorService.getCount(),
      isReady: this.isReady(),
      topK: Number(process.env.TOP_K_RESULTS),
      similarityThreshold: Number(process.env.SIMILARITY_THRESHOLD),
    }
  }
}

export const ragService = new RAGService()
