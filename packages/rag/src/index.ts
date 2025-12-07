import type { QAPair, SearchResult } from "@kellemes/common"
import { Kysely, PostgresDialect, sql } from "kysely"
import { Pool } from "pg"

// Database interface for pgvector - minimal type to avoid circular dependency
interface Database {
  qa_vectors: {
    id: string
    question: string
    answer: string
    embedding: string
  }
}
import "dotenv/config"
import * as fs from "node:fs/promises"
import { join } from "node:path"
import ollama from "ollama/browser"

// Create database connection to avoid circular dependency
const dialect = new PostgresDialect({
  pool: new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    max: 10,
  }),
})

const db = new Kysely<Database>({
  dialect,
})

/**
 * RAG (Retrieval-Augmented Generation) Service
 * Handles ingestion, retrieval, and augmented generation
 */
export class RAGService {
  // constructor() {}

  /**
   * Initialize the RAG service by checking the vector database
   */
  async initialize(): Promise<void> {
    try {
      const count = await this.getCount()

      if (count === 0) {
        console.log("Vector database empty. Run ingestion to populate it.")
      } else {
        console.log(`RAG service initialized with ${count} documents`)
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
      // const data = await fs.readFile(join(process.env.DATA_DIR!, "training/qa.json"), "utf-8")
      // TODO: read data good
      const data = "[]"
      const qaPairs: QAPair[] = JSON.parse(data)

      console.log(`Loaded ${qaPairs.length} Q&A pairs`)

      // Clear existing vectors
      await sql`TRUNCATE TABLE qa_vectors`.execute(db)

      // Generate embeddings for each Q&A pair
      console.log("Generating embeddings...")
      let processedCount = 0

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
        const embeddingResult = await ollama.embed({
          model: process.env.EMBEDDING_MODEL!,
          input: text,
        })

        const embedding = embeddingResult.embeddings.at(0)
        if (!embedding) {
          console.warn(`Skipping Q&A pair ${i} because embedding generation failed.`)
          continue
        }

        // Insert into pgvector database
        // pgvector expects array format: '[1,2,3]'::vector
        const vectorStr = `[${embedding.join(",")}]`
        await sql`
          INSERT INTO qa_vectors (id, question, answer, embedding)
          VALUES (${`qa_${i}`}, ${qa.question}, ${qa.answer}, ${sql.raw(`'${vectorStr}'::vector`)})
        `.execute(db)

        processedCount++
      }

      console.log(`✓ Successfully ingested ${processedCount} documents`)
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
    const threshold = Number(process.env.SIMILARITY_THRESHOLD)

    // Generate embedding for the query using Ollama
    const queryEmbeddingResult = await ollama.embed({
      model: process.env.EMBEDDING_MODEL!,
      input: query,
    })

    const queryEmbedding = queryEmbeddingResult.embeddings.at(0)
    if (!queryEmbedding) {
      return []
    }

    // Search for similar documents using pgvector cosine similarity
    // 1 - cosine_distance = cosine_similarity
    // pgvector expects array format: '[1,2,3]'::vector
    const queryVectorStr = `[${queryEmbedding.join(",")}]`
    const results = await sql<{
      question: string
      answer: string
      score: number
    }>`
      SELECT 
        question,
        answer,
        1 - (embedding <=> ${sql.raw(`'${queryVectorStr}'::vector`)}) as score
      FROM qa_vectors
      WHERE 1 - (embedding <=> ${sql.raw(`'${queryVectorStr}'::vector`)}) >= ${threshold}
      ORDER BY embedding <=> ${sql.raw(`'${queryVectorStr}'::vector`)}
      LIMIT ${k}
    `.execute(db)

    return results.rows.map((row: { question: string; answer: string; score: number | string }) => ({
      question: row.question,
      answer: row.answer,
      score: Number(row.score),
    }))
  }

  /**
   * Check if a query is somewhat personal
   */
  private isCompanionQuery(query: string, sources: SearchResult[]): boolean {
    // If no relevant sources found or all scores are very low, likely gibberish
    if (sources.length === 0 || !sources[0] || sources[0].score < 0.5) {
      return false
    }

    const nonCompanionKeywords =
      /\b(nvidia|gpu|computer|gaming|software|programming|code|app|phone|business|brand|product|sports|football|basketball|youtube|tiktok|instagram|facebook|twitter)\b/i

    if (nonCompanionKeywords.test(query)) {
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
      const response = await ollama.chat({
        model: process.env.OLLAMA_MODEL!,
        messages: [{ role: "user", content: query }],
      })
      return { response: response.message.content, sources: [] }
    }

    // Retrieve relevant context
    const sources = await this.retrieve(query, topK)

    // Check if this is actually a companion query
    if (!this.isCompanionQuery(query, sources)) {
      // Non-companion query - politely redirect
      const redirectPrompt = `You are keLLeMes, a friendly AI companion for talking any sensitive topics.

The user asked: "${query}"

This question is not about my interests or desires. Politely let them know that you're specifically designed to help with emotinal support, flare and velvet, but that you're not a therapist or mental health professional.
Be friendly and encouraging, and invite them to ask any intimacy questions they might have.

Response:`

      const response = await ollama.chat({
        model: process.env.OLLAMA_MODEL!,
        messages: [{ role: "user", content: redirectPrompt }],
      })
      return { response: response.message.content, sources: [] }
    }

    if (sources.length === 0) {
      // No relevant context found, use base model
      const response = await ollama.chat({
        model: process.env.OLLAMA_MODEL!,
        messages: [{ role: "user", content: query }],
      })
      return { response: response.message.content, sources: [] }
    }

    // Build augmented prompt with retrieved context
    const context = sources.map((s, i) => `${i + 1}. Q: ${s.question}\n   A: ${s.answer}`).join("\n\n")

    const augmentedPrompt = `You are keLLeMes, a friendly AI companion for lonely hearts. Answer the user's question using
    ONLY the relevant information provided below if it applies. Always maintain a warm and supportive tone.

IMPORTANT RULES:
- ONLY use the reference information if it directly relates to the question
- Do NOT make assumptions about the user's situation (e.g., don't assume they have any mental health issues)
- If the question is casual or conversational (like "hey", "how are you"), respond naturally, with a cheerful tone
- Be helpful and friendly, but stick to what is actually asked

Reference Information (use only if relevant):
${context}

User's Question: ${query}

Response:`

    // Generate response with augmented context
    const response = await ollama.chat({
      model: process.env.OLLAMA_MODEL!,
      messages: [{ role: "user", content: augmentedPrompt }],
    })

    return { response: response.message.content, sources }
  }

  /**
   * Generate a response without RAG (direct model call)
   */
  async generateDirectResponse(query: string): Promise<string> {
    const response = await ollama.chat({
      model: process.env.OLLAMA_MODEL!,
      messages: [{ role: "user", content: query }],
    })
    return response.message.content
  }

  /**
   * Get the count of vectors in the database
   */
  private async getCount(): Promise<number> {
    const result = await sql<{ count: string }>`SELECT COUNT(*) as count FROM qa_vectors`.execute(db)
    return Number(result.rows[0]?.count ?? 0)
  }

  /**
   * Check if the RAG service is ready
   */
  async isReady(): Promise<boolean> {
    const count = await this.getCount()
    return count > 0
  }

  /**
   * Get statistics about the RAG system
   */
  async getStats() {
    const count = await this.getCount()
    return {
      totalDocuments: count,
      modelName: process.env.OLLAMA_MODEL || "kellemes",
      embeddingModel: process.env.EMBEDDING_MODEL || "nomic-embed-text",
      isReady: count > 0,
      topK: Number(process.env.TOP_K_RESULTS),
      similarityThreshold: Number(process.env.SIMILARITY_THRESHOLD),
    }
  }
}

export const ragService = new RAGService()
