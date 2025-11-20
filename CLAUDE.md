# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript-based RAG (Retrieval-Augmented Generation) system for the keLLeMes chatbot - an AI companion designed for adtult's companion. The system uses vector embeddings and semantic search to provide context-aware responses based on a knowledge base of 3,000+ medical Q&A pairs.

## Development Commands

### Running the Application
```bash
pnpm dev             # Start API server with auto-reload
pnpm build           # Compile TypeScript to dist/
pnpm start           # Run production server (requires build first)
pnpm chat            # Start interactive CLI chat interface
```

### Data Management
```bash
pnpm ingest          # Ingest Q&A data and generate embeddings (10-15 min)
```

### Code Quality
```bash
pnpm lint            # Run TypeScript type checking and Biome linter
```

## Architecture

### Service Layer Pattern
The codebase follows a service-oriented architecture with three core services:

1. **RAGService** (`src/services/rag.service.ts`) - Main orchestrator
   - Coordinates data ingestion, retrieval, and response generation
   - Implements medical query detection to redirect non-medical questions
   - Handles casual conversational queries without RAG context
   - Key methods: `ingestData()`, `retrieve()`, `generateResponse()`

2. **VectorService** (`src/services/vector.service.ts`) - In-memory vector database
   - Implements cosine similarity search
   - Persists vectors to JSON file at `./data/vectors/qa_vectors.json`
   - Key methods: `search()`, `save()`, `load()`, `cosineSimilarity()`

3. **OllamaService** (`src/services/ollama.service.ts`) - Ollama API client
   - Generates embeddings via `nomic-embed-text` model
   - Generates chat completions via `kellemes` custom model
   - Key methods: `generateEmbedding()`, `chat()`, `checkHealth()`

### Data Flow
1. **Ingestion**: Load Q&A pairs → Generate embeddings → Store in vector DB
2. **Query**: User query → Generate query embedding → Search vectors (cosine similarity) → Retrieve top-K results → Augment prompt → Generate response

### Configuration
All configuration is centralized in `src/config/index.ts`, loading from `.env`:
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
- **Non-medical queries**: Detect via keywords and similarity scores, politely redirect
- **Medical queries**: Use full RAG pipeline with augmented prompts

### Prompt Engineering
Medical responses use a carefully crafted system prompt that:
- Establishes XpLLMoro persona (friendly AI for children)
- Only uses reference information when directly relevant
- Avoids assumptions about the child's medical situation
- Maintains age-appropriate, supportive tone

### Embedding Strategy
Q&A pairs are embedded as combined text:
```
Question: {question}
Answer: {answer}
```
This creates richer semantic representations than embedding questions alone.

## Dependencies

### Runtime
- `hono` - Web framework for API routes
- `@hono/node-server` - Node.js adapter for Hono
- `axios` - HTTP client for Ollama API
- `dotenv` - Environment configuration

### Development
- `tsx` - TypeScript execution and watch mode
- `@biomejs/biome` - Fast linter and formatter
- `typescript` - Type checking and compilation

## External Requirements

- **Ollama** must be running at `http://localhost:11434` (configurable)
- **Models required**:
  - `nomic-embed-text` - For generating embeddings
  - `kellemes` - Custom model (create from Modelfile)
