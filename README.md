# keLLeMes RAG System

A TypeScript-based Retrieval-Augmented Generation (RAG) system for the keLLeMes freestyle chatbot. This system uses vector embeddings and semantic search to provide context-aware responses based on a knowledge base.

## ⚡ Quick Start

Get up and running in 5 minutes!

### Prerequisites

- [Node.js](mise.toml#L14) installed (by Mise:)
- [Ollama](https://ollama.com/library/smollm2) installed and running
- [Mise](https://mise.jdx.dev/) recommended

### Environment

Create and set up an `.env` file with the following:

```ini
# Server Configuration
PORT=3000
NODE_ENV=development

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=kellemes

# Embedding Configuration
EMBEDDING_MODEL=nomic-embed-text
EMBEDDING_DIMENSION=768

# RAG Configuration
TOP_K_RESULTS=3
SIMILARITY_THRESHOLD=0.7
```

> …or do nothing, Mise sets the defaults.

### Install dependencies

```sh
pnpm install
```

### Ollama Models

```sh
# Pull the embedding model
ollama pull nomic-embed-text

# Create your custom model from the Modelfile
ollama create kellemes -f data/training/Modelfile
```

### Data Ingestion

Before using the RAG system, populate the vector database:

```sh
pnpm run ingest
```

This will:
- Load all 3,000+ Q&A pairs from `qa.json`
- Generate embeddings for each pair using Ollama
- Save the vector database to `./data/vectors/qa_vectors.json`

**Note**: Takes 10-15 minutes depending on your hardware.

That's it! You're now chatting with keLLeMes powered by RAG.

### CLI Commands

- `/help` - Show all commands
- `/rag` - Toggle RAG on/off
- `/sources` - Toggle source display
- `/topk 5` - Change number of context docs
- `/stats` - View system stats
- `/exit` - Quit

---

## 📚 Full Documentation

## Features

- **RAG Pipeline**: Complete retrieval-augmented generation with semantic search
- **Vector Database**: In-memory vector store with cosine similarity search
- **Ollama Integration**: Local LLM inference and embeddings
- **REST API**: Hono-based API with multiple endpoints
- **Interactive CLI**: Beautiful command-line chat interface
- **TypeScript**: Fully typed codebase for better developer experience
- **Easy Ingestion**: Simple script to populate the vector database

## Architecture

```
┌─────────────┐
│   User      │
│   Query     │
└──────┬──────┘
       │
       v
┌─────────────────────────────────────┐
│     Hono API Server                 │
│  ┌─────────────────────────────┐    │
│  │  POST /api/chat             │    │
│  │  POST /api/retrieve         │    │
│  │  GET  /api/stats            │    │
│  └─────────────────────────────┘    │
└──────────┬──────────────────────────┘
           │
           v
    ┌──────────────┐
    │ RAG Service  │
    └──────┬───────┘
           │
      ┌────┴────┐
      │         │
      v         v
┌──────────┐ ┌─────────────┐
│ Vector   │ │  Ollama     │
│ Service  │ │  Service    │
└──────────┘ └─────────────┘
      │              │
      v              v
┌──────────┐ ┌─────────────┐
│ qa.json  │ │ nomic-embed │
│ vectors  │ │ kellemes    │
└──────────┘ └─────────────┘
```

## Usage

### Interactive CLI (Recommended)

```bash
pnpm run chat
```

Features:
- Chat directly with the RAG-powered chatbot
- Toggle RAG mode on/off
- View source documents used for responses
- Adjust the number of context documents
- See system statistics

### REST API Server

```bash
# Development mode (with auto-reload)
pnpm run dev

# Production mode
pnpm run build
pnpm start
```

[Server](API.md) starts on `http://localhost:3000` by default.

## How RAG Works

1. **Ingestion Phase**:
   - Load Q&A pairs from `qa.json`
   - Generate embeddings using `nomic-embed-text`
   - Store embeddings in vector database

2. **Query Phase**:
   - User sends a query
   - Generate embedding for the query
   - Search vector database using cosine similarity
   - Retrieve top-K most relevant Q&A pairs
   - Augment prompt with retrieved context
   - Generate response using `kellemes`

## Performance Tips

- **Batch Processing**: The ingestion script processes embeddings sequentially. For faster ingestion, modify the code to batch requests.
- **Caching**: The vector database is saved to disk and loaded on startup for fast retrieval.
- **Top-K Tuning**: Adjust `TOP_K_RESULTS` in `.env` to balance between context quality and response time.
- **Similarity Threshold**: Increase `SIMILARITY_THRESHOLD` for more relevant results (but potentially fewer matches).
