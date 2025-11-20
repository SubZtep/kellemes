#!/usr/bin/env node

/**
 * Interactive CLI chat interface for keLLeMes RAG
 *
 * Run with: npm run chat
 */

import * as readline from "node:readline"
import config from "./config"
import { ollamaService } from "./services/ollama.service"
import { ragService } from "./services/rag.service"

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
}

interface CLIOptions {
  useRAG: boolean
  topK: number
  showSources: boolean
}

class ChatCLI {
  private rl: readline.Interface
  private options: CLIOptions

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${colors.cyan}You${colors.reset} > `,
    })

    this.options = {
      useRAG: true,
      topK: 3,
      showSources: true,
    }
  }

  private printWelcome(): void {
    console.log(`\n${colors.bright}${colors.magenta}╔═══════════════════════════════════════╗${colors.reset}`)
    console.log(`${colors.bright}${colors.magenta}║   keLLeMes RAG Chat Interface         ║${colors.reset}`)
    console.log(`${colors.bright}${colors.magenta}╚═══════════════════════════════════════╝${colors.reset}\n`)
    console.log(`${colors.dim}A friendly AI companion for medical questions${colors.reset}\n`)
    console.log(`${colors.yellow}Commands:${colors.reset}`)
    console.log(`  ${colors.green}/help${colors.reset}     - Show available commands`)
    console.log(
      `  ${colors.green}/rag${colors.reset}      - Toggle RAG mode (currently: ${this.options.useRAG ? "ON" : "OFF"})`,
    )
    console.log(
      `  ${colors.green}/sources${colors.reset}  - Toggle source display (currently: ${this.options.showSources ? "ON" : "OFF"})`,
    )
    console.log(
      `  ${colors.green}/topk N${colors.reset}   - Set number of context documents (currently: ${this.options.topK})`,
    )
    console.log(`  ${colors.green}/stats${colors.reset}    - Show system statistics`)
    console.log(`  ${colors.green}/clear${colors.reset}    - Clear the screen`)
    console.log(`  ${colors.green}/exit${colors.reset}     - Exit the chat\n`)
    console.log(`${colors.dim}Type your question and press Enter to chat${colors.reset}\n`)
  }

  private printStats(): void {
    const stats = ragService.getStats()
    console.log(`\n${colors.yellow}System Statistics:${colors.reset}`)
    console.log(`  Documents: ${stats.totalDocuments}`)
    console.log(
      `  RAG Ready: ${stats.isReady ? `${colors.green}Yes${colors.reset}` : `${colors.red}No${colors.reset}`}`,
    )
    console.log(`  Top-K: ${stats.topK}`)
    console.log(`  Similarity Threshold: ${stats.similarityThreshold}`)
    console.log(`  Model: ${config.ollama.model}`)
    console.log(`  Embedding Model: ${config.ollama.embeddingModel}\n`)
  }

  private printHelp(): void {
    console.log(`\n${colors.yellow}Available Commands:${colors.reset}`)
    console.log(`  ${colors.green}/help${colors.reset}       - Show this help message`)
    console.log(
      `  ${colors.green}/rag${colors.reset}        - Toggle RAG mode (${this.options.useRAG ? "currently ON" : "currently OFF"})`,
    )
    console.log(
      `  ${colors.green}/sources${colors.reset}    - Toggle source display (${this.options.showSources ? "currently ON" : "currently OFF"})`,
    )
    console.log(
      `  ${colors.green}/topk <N>${colors.reset}   - Set number of documents to retrieve (current: ${this.options.topK})`,
    )
    console.log(`  ${colors.green}/stats${colors.reset}      - Show system statistics`)
    console.log(`  ${colors.green}/clear${colors.reset}      - Clear the screen`)
    console.log(`  ${colors.green}/exit${colors.reset}       - Exit the chat`)
    console.log(`  ${colors.green}/quit${colors.reset}       - Exit the chat\n`)
  }

  private async handleCommand(command: string): Promise<boolean> {
    const parts = command.trim().split(/\s+/)
    const cmd = parts[0].toLowerCase()

    switch (cmd) {
      case "/help":
      case "/h":
        this.printHelp()
        return true

      case "/rag":
        this.options.useRAG = !this.options.useRAG
        console.log(`\n${colors.yellow}RAG mode ${this.options.useRAG ? "enabled" : "disabled"}${colors.reset}\n`)
        return true

      case "/sources":
        this.options.showSources = !this.options.showSources
        console.log(
          `\n${colors.yellow}Source display ${this.options.showSources ? "enabled" : "disabled"}${colors.reset}\n`,
        )
        return true

      case "/topk":
        if (parts.length < 2) {
          console.log(`\n${colors.red}Usage: /topk <number>${colors.reset}\n`)
        } else {
          const n = parseInt(parts[1], 10)
          if (Number.isNaN(n) || n < 1 || n > 10) {
            console.log(`\n${colors.red}Please provide a number between 1 and 10${colors.reset}\n`)
          } else {
            this.options.topK = n
            console.log(`\n${colors.yellow}Top-K set to ${n}${colors.reset}\n`)
          }
        }
        return true

      case "/stats":
        this.printStats()
        return true

      case "/clear":
      case "/cls":
        console.clear()
        this.printWelcome()
        return true

      case "/exit":
      case "/quit":
      case "/q":
        console.log(`\n${colors.dim}Goodbye! 👋${colors.reset}\n`)
        return false

      default:
        console.log(`\n${colors.red}Unknown command: ${cmd}${colors.reset}`)
        console.log(`${colors.dim}Type /help for available commands${colors.reset}\n`)
        return true
    }
  }

  private async processQuery(query: string): Promise<void> {
    try {
      console.log(`\n${colors.blue}keLLeMes${colors.reset} > ${colors.dim}Thinking...${colors.reset}`)

      if (this.options.useRAG) {
        const result = await ragService.generateResponse(query, this.options.topK)

        // Clear the "Thinking..." line
        process.stdout.write("\x1b[1A\x1b[2K")
        console.log(`${colors.blue}keLLeMes${colors.reset} > ${result.response}\n`)

        if (this.options.showSources && result.sources.length > 0) {
          console.log(`${colors.dim}${colors.yellow}📚 Sources (${result.sources.length}):${colors.reset}`)
          result.sources.forEach((source, i) => {
            const scorePercent = (source.score * 100).toFixed(1)
            console.log(`${colors.dim}  ${i + 1}. [${scorePercent}%] ${source.question}${colors.reset}`)
          })
          console.log("")
        }
      } else {
        const response = await ragService.generateDirectResponse(query)

        // Clear the "Thinking..." line
        process.stdout.write("\x1b[1A\x1b[2K")
        console.log(`${colors.blue}keLLeMes${colors.reset} > ${response}\n`)
      }
    } catch (error) {
      process.stdout.write("\x1b[1A\x1b[2K")
      console.log(`${colors.red}Error: ${error instanceof Error ? error.message : "Unknown error"}${colors.reset}\n`)
    }
  }

  async start(): Promise<void> {
    try {
      // Initialize
      console.log(`${colors.dim}Initializing...${colors.reset}`)

      // Check Ollama
      const isHealthy = await ollamaService.checkHealth()
      if (!isHealthy) {
        console.error(`\n${colors.red}✗ Error: Ollama is not running${colors.reset}`)
        console.error(`${colors.yellow}Please start Ollama and ensure models are available:${colors.reset}`)
        console.error(`  ollama pull nomic-embed-text`)
        console.error(`  ollama create kellemes -f Modelfile\n`)
        process.exit(1)
      }

      // Initialize RAG
      await ragService.initialize()

      if (!ragService.isReady()) {
        console.warn(`\n${colors.yellow}⚠ Warning: Vector database is empty${colors.reset}`)
        console.warn(`${colors.yellow}Run 'npm run ingest' to populate the database${colors.reset}`)
        console.warn(`${colors.yellow}RAG features will not work until ingestion is complete${colors.reset}\n`)

        // Disable RAG by default if not ready
        this.options.useRAG = false
      }

      // Show welcome
      console.clear()
      this.printWelcome()

      // Setup readline handlers
      this.rl.on("line", async (input: string) => {
        const trimmed = input.trim()

        if (!trimmed) {
          this.rl.prompt()
          return
        }

        if (trimmed.startsWith("/")) {
          const shouldContinue = await this.handleCommand(trimmed)
          if (!shouldContinue) {
            this.rl.close()
            process.exit(0)
          }
        } else {
          await this.processQuery(trimmed)
        }

        this.rl.prompt()
      })

      this.rl.on("close", () => {
        console.log(`\n${colors.dim}Goodbye! 👋${colors.reset}\n`)
        process.exit(0)
      })

      // Start prompting
      this.rl.prompt()
    } catch (error) {
      console.error(`\n${colors.red}Fatal error:${colors.reset}`, error)
      process.exit(1)
    }
  }
}

// Handle Ctrl+C gracefully
process.on("SIGINT", () => {
  console.log(`\n\n${colors.dim}Goodbye! 👋${colors.reset}\n`)
  process.exit(0)
})

// Start the CLI
const cli = new ChatCLI()
cli.start()
