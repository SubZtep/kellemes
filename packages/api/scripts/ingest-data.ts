#!/usr/bin/env node

/**
 * Data ingestion script
 * Run this to populate the vector database with Q&A embeddings
 */

import { ollamaService } from "@kellemes/ollama-service"
import { ragService } from "@kellemes/rag-service"

async function main() {
  console.log("=== keLLeMes RAG Data Ingestion ===\n")

  try {
    // Check Ollama connectivity
    console.log("Checking Ollama connection...")
    const isHealthy = await ollamaService.checkHealth()

    if (!isHealthy) {
      console.error("✗ Ollama is not running or not accessible")
      console.error("Please start Ollama and ensure the embedding model is available")
      console.error("Run: ollama pull nomic-embed-text")
      process.exit(1)
    }

    console.log("✓ Ollama is running\n")

    // Initialize RAG service
    console.log("Initializing RAG service...")
    await ragService.initialize()

    // Ingest data
    await ragService.ingestData()

    // Show stats
    const stats = ragService.getStats()
    console.log("\n=== Ingestion Complete ===")
    console.log(`Total documents: ${stats.totalDocuments}`)
    console.log(`Ready: ${stats.isReady}`)

    process.exit(0)
  } catch (error) {
    console.error("\n✗ Error during ingestion:", error)
    process.exit(1)
  }
}

main()
