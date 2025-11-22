# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript-based RAG (Retrieval-Augmented Generation) system for the keLLeMes chatbot - an AI companion designed for adults. The system uses vector embeddings and semantic search to provide context-aware responses based on a knowledge base of 3,000+ relationship Q&A pairs.

**Monorepo Structure**: This project uses pnpm workspaces to organize code into fine-grained, reusable packages.

## Development Commands

### Running the Application
```bash
# API Server
pnpm dev:api         # Start API server with auto-reload
pnpm start           # Run production API server

# CLI
pnpm dev:cli         # Start interactive parameter tweaking UI
pnpm cli             # Run CLI

# Build & Quality
pnpm build           # Build all packages
pnpm lint            # Lint all packages
```

### Data Management
```bash
pnpm ingest          # Ingest Q&A data and generate embeddings (10-15 min)
```

## Architecture

### Monorepo Structure
```
kellemes/
├── packages/
│   ├── types/              # @kellemes/types - Shared TypeScript interfaces
│   ├── ollama-service/     # @kellemes/ollama-service - Ollama API client
│   ├── vector-service/     # @kellemes/vector-service - Vector DB & similarity search
│   ├── rag-service/        # @kellemes/rag-service - RAG orchestration
│   ├── core/               # @kellemes/core - Convenience re-export of all services
│   ├── api/                # @kellemes/api - Hono HTTP API server
│   └── cli/                # @kellemes/cli - Ink-based parameter tweaking UI
├── data/                   # Local data (vectors, training data)
└── package.json            # Root workspace config
```

### Package Dependency Graph
- `@kellemes/types` → Base types, no dependencies
- `@kellemes/ollama-service` → Depends on types
- `@kellemes/vector-service` → Depends on types
- `@kellemes/rag-service` → Depends on types, ollama-service, vector-service
- `@kellemes/core` → Re-exports all services (convenience package)
- `@kellemes/api` → Depends on core (HTTP layer)
- `@kellemes/cli` → Depends on core (Text UI with Ink)

### Core Services

1. **RAGService** (`packages/rag-service/src/index.ts`)
   - Coordinates data ingestion, retrieval, and response generation
   - Implements companion query detection to redirect non-companion questions
   - Handles casual conversational queries without RAG context
   - Key methods: `ingestData()`, `retrieve()`, `generateResponse()`

2. **VectorService** (`packages/vector-service/src/index.ts`)
   - In-memory vector database with cosine similarity search
   - Persists vectors to JSON file at `./data/vectors/qa_vectors.json`
   - Key methods: `search()`, `save()`, `load()`, `cosineSimilarity()`

3. @deprecated **OllamaService** (`packages/ollama-service/src/index.ts`)
   - Ollama API client for embeddings and chat completions
   - Uses `nomic-embed-text` for embeddings, `kellemes` for chat
   - Key methods: `generateEmbedding()`, `chat()`, `checkHealth()`

### Applications

1. **API Server** (`packages/api/src/index.ts`)
   - Hono-based HTTP server exposing RAG endpoints
   - Routes: `/api/chat`, `/api/retrieve`, `/api/stats`, `/health`
   - Runs on port specified in `.env` (default: 3000)

2. **CLI** (`packages/cli/src/index.tsx`)
   - Interactive Ink-based UI for parameter tuning
   - Real-time parameter adjustment (topK, similarity threshold, temperature)
   - Live query testing with source visualization
   - Keyboard controls: ↑/↓ navigate, ←/→ adjust, Enter for input, Esc to quit
   - Tab and Shift Tab is for moving the focus one step away

### Data Flow
1. **Ingestion**: Load Q&A pairs → Generate embeddings → Store in vector DB
2. **Query**: User query → Generate query embedding → Search vectors (cosine similarity) → Retrieve top-K results → Augment prompt → Generate response

### Configuration
Configuration loads from `.env` at the repository root:
- Ollama base URL and model names
- Vector database path
- RAG parameters (topK, similarity threshold)

## TypeScript Configuration

- Strict mode enabled with `noUncheckedIndexedAccess`
- ES2022 target with ESM modules
- Source maps and declarations generated
- Unused locals/parameters flagged as errors

## Code Style (Biome)

- 2-space indentation
- 120 character line width
- Double quotes for strings
- Semicolons as needed (not required)
- Auto-organize imports enabled

## Key Implementation Details

### RAG Query Logic
The RAG service implements intelligent query routing:
- **Casual queries** (greetings < 30 chars): Bypass RAG, use base model
- **Non-companion queries**: Detect via keywords and similarity scores, politely redirect
- **Companion queries**: Use full RAG pipeline with augmented prompts

### Prompt Engineering
Codependent responses use a carefully crafted system prompt that:
- Establishes keLLeMes persona (friendly AI companion)
- Only uses reference information when directly relevant
- Avoids assumptions about the users' mental health situation
- Maintains submissive, supportive tone

### Embedding Strategy
Q&A pairs are embedded as combined text:
```
Question: {question}
Answer: {answer}
```
This creates richer semantic representations than embedding questions alone.

## Dependencies

### Core Services
- `axios` - HTTP client for Ollama API
- `dotenv` - Environment configuration

### API Server
- `hono` - Web framework for HTTP routes
- `@hono/node-server` - Node.js adapter for Hono

### Chat CLI
- Node.js `readline` - Built-in terminal input/output

### Tweak CLI (Interactive UI)
- `ink` - React-based CLI rendering framework
- `ink-spinner` - Loading spinner component
- `ink-text-input` - Text input component
- `react` - UI component library

### Development
- `tsx` - TypeScript execution and watch mode
- `@biomejs/biome` - Fast linter and formatter
- `typescript` - Type checking and compilation
- `pnpm` - Fast, disk-efficient package manager

## External Requirements

- **Ollama** must be running at `http://localhost:11434` (configurable)
- **Models required**:
  - `nomic-embed-text` - For generating embeddings
  - `kellemes` - Custom model (create from Modelfile)
- **Mise** dev env https://mise.jdx.dev
