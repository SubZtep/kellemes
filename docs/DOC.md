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
