# keLLeMes RAG System

A TypeScript-based Retrieval-Augmented Generation (RAG) system for the keLLeMes freestyle chatbot. This system uses vector embeddings and semantic search to provide context-aware responses based on a knowledge base.

## ⚡ Quick Start

Get up and running in 5 minutes!

### Prerequisites

- Node.js installed
- Ollama installed and running

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env

# 3. Prepare Ollama models
ollama pull nomic-embed-text
ollama create kellemes -f Modelfile

# 4. Ingest the data (takes ~10-15 minutes)
npm run ingest

# 5. Start chatting!
npm run chat
```

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

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work for local development):

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=kellemes
EMBEDDING_MODEL=nomic-embed-text
EMBEDDING_DIMENSION=768

# Vector Database
VECTOR_DB_PATH=./data/vectors

# RAG Configuration
TOP_K_RESULTS=3
SIMILARITY_THRESHOLD=0.7
```

### 3. Ollama Models

```bash
# Pull the embedding model
ollama pull nomic-embed-text

# Create your custom model from the Modelfile
ollama create kellemes -f Modelfile
```

### 4. Data Ingestion

Before using the RAG system, populate the vector database:

```bash
npm run ingest
```

This will:
- Load all 3,000+ Q&A pairs from `qa.json`
- Generate embeddings for each pair using Ollama
- Save the vector database to `./data/vectors/qa_vectors.json`

**Note**: Takes 10-15 minutes depending on your hardware.

## Usage

### Interactive CLI (Recommended)

```bash
npm run chat
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
npm run dev

# Production mode
npm run build
npm start
```

Server starts on `http://localhost:3000` by default.

## API Reference

### POST /api/chat

Send a query and get an AI response augmented with relevant context.

**Request:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Does a bone marrow transplant hurt?",
    "topK": 3,
    "useRAG": true
  }'
```

**Response:**
```json
{
  "response": "A bone marrow transplant doesn't hurt...",
  "sources": [
    {
      "question": "Does a bone marrow transplant hurt?",
      "answer": "A bone marrow transplant doesn't hurt. It's a bit like having a blood transfusion.",
      "score": 0.95
    }
  ],
  "model": "kellemes-rag"
}
```

### POST /api/retrieve

Get relevant documents without generating a response.

**Request:**
```bash
curl -X POST http://localhost:3000/api/retrieve \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is chemotherapy?",
    "topK": 5
  }'
```

**Response:**
```json
{
  "query": "What is chemotherapy?",
  "results": [...],
  "count": 5
}
```

### GET /api/stats

Get system statistics.

**Request:**
```bash
curl http://localhost:3000/api/stats
```

**Response:**
```json
{
  "totalDocuments": 2017,
  "isReady": true,
  "topK": 3,
  "similarityThreshold": 0.7
}
```

### GET /health

Health check endpoint.

**Request:**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "healthy",
  "ollama": "connected",
  "rag": "ready",
  "timestamp": "2025-11-20T10:30:00.000Z"
}
```

## Project Structure

```
xploro-chat/
├── src/
│   ├── config/
│   │   └── index.ts              # Configuration management
│   ├── routes/
│   │   └── chat.routes.ts        # API routes (Hono)
│   ├── services/
│   │   ├── ollama.service.ts     # Ollama API integration
│   │   ├── vector.service.ts     # Vector database operations
│   │   └── rag.service.ts        # RAG orchestration
│   ├── scripts/
│   │   └── ingest-data.ts        # Data ingestion script
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── cli.ts                    # Interactive CLI chat
│   └── index.ts                  # Main server entry point
├── data/
│   └── vectors/                  # Generated vector database
├── qa.json                       # Source Q&A knowledge base (2017 pairs)
├── Modelfile                     # Ollama model configuration
├── package.json
├── tsconfig.json
└── .env
```

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

## Client Examples

### JavaScript/TypeScript

```typescript
async function chat(query: string) {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, useRAG: true })
  });

  const data = await response.json();
  console.log('Response:', data.response);
  console.log('Sources:', data.sources);
}

chat('What is an X-ray?');
```

### Python

```python
import requests

def chat(query):
    response = requests.post(
        'http://localhost:3000/api/chat',
        json={'query': query, 'useRAG': True}
    )
    data = response.json()
    print('Response:', data['response'])
    print('Sources:', data.get('sources', []))

chat('What is an X-ray?')
```

## Troubleshooting

### Ollama not running

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama if needed
ollama serve
```

### Missing models

```bash
# Pull required models
ollama pull nomic-embed-text
ollama create kellemes -f Modelfile
```

### Empty vector database

```bash
# Re-run ingestion
npm run ingest
```

### TypeScript errors

```bash
# Rebuild the project
npm run build
```

## Performance Tips

- **Batch Processing**: The ingestion script processes embeddings sequentially. For faster ingestion, modify the code to batch requests.
- **Caching**: The vector database is saved to disk and loaded on startup for fast retrieval.
- **Top-K Tuning**: Adjust `TOP_K_RESULTS` in `.env` to balance between context quality and response time.
- **Similarity Threshold**: Increase `SIMILARITY_THRESHOLD` for more relevant results (but potentially fewer matches).
