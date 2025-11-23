## API Endpoints

```json
{
  chat: "POST /api/chat",
  retrieve: "POST /api/retrieve",
  stats: "GET /api/stats",
  health: "GET /health",
}
```

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
