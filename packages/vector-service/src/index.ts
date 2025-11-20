import * as fs from "node:fs/promises"
import * as path from "node:path"
import type { EmbeddedQAPair, SearchResult } from "@kellemes/types"

/**
 * Simple in-memory vector database with persistence
 * Uses cosine similarity for semantic search
 */
export class VectorService {
  private vectors: EmbeddedQAPair[] = []
  private dbPath: string

  constructor(dbPath: string) {
    this.dbPath = dbPath
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error("Vectors must have the same dimension")
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i]! * vecB[i]!
      normA += vecA[i]! * vecA[i]!
      normB += vecB[i]! * vecB[i]!
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  /**
   * Add a single vector to the database
   */
  addVector(data: EmbeddedQAPair): void {
    this.vectors.push(data)
  }

  /**
   * Add multiple vectors to the database
   */
  addVectors(data: EmbeddedQAPair[]): void {
    this.vectors.push(...data)
  }

  /**
   * Search for similar vectors using cosine similarity
   */
  search(queryEmbedding: number[], topK: number = 5, threshold: number = 0.0): SearchResult[] {
    const results = this.vectors.map(item => ({
      question: item.question,
      answer: item.answer,
      score: this.cosineSimilarity(queryEmbedding, item.embedding),
    }))

    // Filter by threshold and sort by score
    return results
      .filter(result => result.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }

  /**
   * Save vectors to disk
   */
  async save(): Promise<void> {
    try {
      const dir = path.dirname(this.dbPath)
      await fs.mkdir(dir, { recursive: true })

      const data = JSON.stringify(this.vectors, null, 2)
      await fs.writeFile(this.dbPath, data, "utf-8")

      console.log(`Saved ${this.vectors.length} vectors to ${this.dbPath}`)
    } catch (error) {
      console.error("Error saving vectors:", error)
      throw new Error("Failed to save vector database")
    }
  }

  /**
   * Load vectors from disk
   */
  async load(): Promise<void> {
    try {
      const data = await fs.readFile(this.dbPath, "utf-8")
      this.vectors = JSON.parse(data)

      console.log(`Loaded ${this.vectors.length} vectors from ${this.dbPath}`)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        console.log("No existing vector database found. Starting fresh.")
        this.vectors = []
      } else {
        console.error("Error loading vectors:", error)
        throw new Error("Failed to load vector database")
      }
    }
  }

  /**
   * Get the number of vectors in the database
   */
  getCount(): number {
    return this.vectors.length
  }

  /**
   * Clear all vectors from the database
   */
  clear(): void {
    this.vectors = []
  }

  /**
   * Check if the database has been initialized
   */
  isInitialized(): boolean {
    return this.vectors.length > 0
  }
}
