#!/usr/bin/env node

/**
 * Data ingestion script
 * Run this to populate the vector database with Q&A embeddings
 */

import { ragService } from "@kellemes/rag"
import ollama from "ollama/browser"

async function main() {
  console.log("=== keLLeMes RAG Data Ingestion ===\n")

  try {
    // Check Ollama connectivity
    console.log("Checking Ollama connection...")
    const isHealthy = !!(await ollama.version())

    if (!isHealthy) {
      console.error("✗ Ollama is not running or not accessible")
      console.error("Please start Ollama and ensure the embedding model is available")
      console.error("Run: ollama pull nomic-embed-text")
      process.exit(1)
    }

    console.log("✓ Ollama is running\n")

    console.log("Initializing RAG service...")
    await ragService.initialize()

    await ragService.ingestData()

    const stats = ragService.getStats()
    console.log("\n=== Ingestion Complete ===")
    console.log(`Total documents: ${(await stats).totalDocuments}`)
    console.log(`Ready: ${(await stats).isReady}`)

    process.exit(0)
  } catch (error) {
    console.error("\n✗ Error during ingestion:", error)
    process.exit(1)
  }
}

main()
