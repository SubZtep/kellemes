# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript-based RAG (Retrieval-Augmented Generation) system for the keLLeMes chatbot - an AI companion designed for adults. The system uses vector embeddings and semantic search to provide context-aware responses based on a knowledge base of 3,000+ relationship Q&A pairs.

**Monorepo Structure**: This project uses pnpm workspaces to organize code into fine-grained, reusable packages.

## Development Commands

### Running the Application
```bash
# API Server
pnpm --filter @kellemes/api dev    # Start API server with auto-reload (tsx watch)
pnpm start                          # Run production API server

# CLI
pnpm --filter @kellemes/cli dev    # Start CLI in dev mode (tsx watch)
pnpm cli                            # Run CLI

# Build & Quality
pnpm build           # Build all packages
pnpm lint            # Lint all packages
pnpm typecheck       # Type check all packages
pnpm test            # Run tests across all packages
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
│   ├── common/             # @kellemes/common - Shared types/schemas/constants
│   ├── ollama-service/     # @kellemes/ollama-service - Ollama API client (deprecated)
│   ├── vector-service/     # @kellemes/vector-service - Vector DB & similarity search
│   ├── rag/                # @kellemes/rag - RAG orchestration
│   ├── api/                # @kellemes/api - Hono HTTP API server with PostgreSQL
│   │   └── db/             # Database migrations, schemas, and Kysely setup
│   ├── cli/                # @kellemes/cli - Interactive Ink-based chat UI
│   └── rag-service/        # (legacy - build artifacts only)
├── data/                   # Local data (vectors, training data)
├── .env                    # Environment configuration
└── package.json            # Root workspace config
```

### Package Dependency Graph
- `@kellemes/common` → Shared primitives (types/schemas/constants), no deps
- `@kellemes/ollama-service` → Depends on types
- `@kellemes/vector-service` → Depends on types
- `@kellemes/rag` → Depends on common, ollama-service, vector-service
- `@kellemes/api` → Depends on rag, ollama-service, common
- `@kellemes/cli` → Depends on rag, common

### Core Services

1. **RAGService** (`packages/rag/src/index.ts`)
   - Coordinates data ingestion, retrieval, and response generation
   - Implements companion query detection to redirect non-companion questions
   - Handles casual conversational queries without RAG context
   - Key methods: `ingestData()`, `retrieve()`, `generateResponse()`

2. **VectorService** (`packages/vector-service/src/index.ts`)
   - In-memory vector database with cosine similarity search
   - Persists vectors to JSON file at `./data/vectors/qa_vectors.json`
   - Key methods: `search()`, `save()`, `load()`, `cosineSimilarity()`

3. **Database Layer** (`packages/api/db/`)
   - PostgreSQL database with Kysely query builder
   - Migration system for schema versioning
   - Connection pooling via `pg` (PostgresSQL client)
   - Environment-based configuration (host, port, database, user, password)
   - Key files: `database.ts`, `migrator.ts`, `types.ts`, `migrations/`

### Applications

1. **API Server** (`packages/api/src/index.ts`)
   - Hono-based HTTP server with OpenAPI/Zod validation
   - Automatic database migrations on startup
   - Interactive API documentation via Scalar at `/docs`
   - Routes:
     - `POST /chat` - Main chat endpoint with optional RAG support
     - `POST /retrieve` - Retrieve similar Q&A pairs
     - `GET /stats` - Service statistics
     - `GET /health` - Health check (Ollama + RAG status)
     - `GET /docs` - Interactive API documentation
     - `GET /openapi.json` - OpenAPI specification
   - Runs on port specified in `.env` as `API_PORT` (e.g., 3001)

2. **CLI** (`packages/cli/src/index.tsx`)
   - Interactive Ink-based chat interface
   - Built with React, Ink, TanStack Query, and Zustand for state management
   - Real-time chat with Ollama integration
   - Model selection and configuration
   - Rich UI components (titled boxes, gradients, spinners, big text)
   - Keyboard navigation and text input controls

### Data Flow
1. **Ingestion**: Load Q&A pairs → Generate embeddings → Store in vector DB
2. **Query**: User query → Generate query embedding → Search vectors (cosine similarity) → Retrieve top-K results → Augment prompt → Generate response

### Configuration
Configuration loads from `.env` at the repository root:
- `API_PORT` - HTTP server port (e.g., 3001)
- `OLLAMA_BASE_URL` - Ollama API endpoint
- `POSTGRES_HOST` - PostgreSQL host
- `POSTGRES_PORT` - PostgreSQL port
- `POSTGRES_DB` - Database name
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password
- Vector database path and RAG parameters

## TypeScript Configuration

- Strict mode enabled with `noUncheckedIndexedAccess`
- ES2022 target with ESM modules
- Source maps and declarations generated
- Unused locals/parameters flagged as errors

### ESM Import Requirements

**CRITICAL**: All packages use `"type": "module"` and Node.js ESM, which requires explicit `.js` extensions on ALL relative imports.

**Rules**:
1. All relative imports MUST include `.js` extension (even in `.ts` files)
   - ✓ `import { foo } from "./bar.js"`
   - ✗ `import { foo } from "./bar"`
2. Directory index imports must be explicit
   - ✓ `import { foo } from "./utils/index.js"`
   - ✗ `import { foo } from "./utils"`
3. Package imports (from `node_modules`) do NOT need extensions
   - ✓ `import { Hono } from "hono"`

**Build Structure**:
- Packages with multiple source directories (e.g., `api` with `src/`, `db/`, `scripts/`) use `rootDir: "."` in `tsconfig.json`
- This preserves directory structure in output: `dist/src/`, `dist/db/`, `dist/scripts/`
- All `package.json` entry points must reflect this structure (e.g., `"main": "./dist/src/index.js"`)

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
- `dotenv` - Environment configuration
- `ollama` - Official Ollama JavaScript SDK

### API Server
- `hono` - Fast, lightweight web framework
- `@hono/node-server` - Node.js adapter for Hono
- `@hono/zod-openapi` - OpenAPI integration with Zod validation
- `@scalar/hono-api-reference` - Interactive API documentation UI
- `kysely` - Type-safe SQL query builder
- `pg` - PostgreSQL client
- `@types/pg` - TypeScript types for PostgreSQL

### CLI
- `ink` - React-based CLI rendering framework
- `ink-spinner`, `ink-text-input`, `ink-select-input` - UI components
- `ink-big-text`, `ink-gradient` - Visual enhancements
- `@mishieck/ink-titled-box` - Titled box component
- `fullscreen-ink` - Fullscreen terminal UI
- `react` - UI component library (v19)
- `@tanstack/react-query` - Async state management
- `zustand` - Lightweight state management
- `date-fns` - Date utilities

### Development & Testing
- `tsx` - TypeScript execution and watch mode
- `@biomejs/biome` - Fast linter and formatter
- `typescript` - Type checking and compilation
- `vitest` - Fast unit test framework
- `evalite` - LLM evaluation framework
- `autoevals` - Automated evaluation utilities
- `pnpm` - Fast, disk-efficient package manager
- `husky` - Git hooks
- `@commitlint/cli` + `@commitlint/config-conventional` - Commit message linting

## External Requirements

- **Ollama** must be running (configurable via `OLLAMA_BASE_URL`)
- **PostgreSQL** database must be available and configured via environment variables
- **Models required**:
  - `nomic-embed-text` - For generating embeddings
  - `kellemes` - Custom model (create from Modelfile)
- **Mise** - Development environment manager (https://mise.jdx.dev)
- **Docker** (optional) - For containerized PostgreSQL and Ollama
