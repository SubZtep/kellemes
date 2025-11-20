/**
 * Example TypeScript client for the keLLeMes RAG API
 *
 * Run with: node --experimental-strip-types examples/chat-client.ts
 */

interface ChatResponse {
  response: string
  sources?: Array<{
    question: string
    answer: string
    score: number
  }>
  model: string
}

async function chat(query: string, useRAG: boolean = true): Promise<void> {
  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        topK: 3,
        useRAG,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ChatResponse = await response.json()

    console.log("\n=== Query ===")
    console.log(query)

    console.log("\n=== Response ===")
    console.log(data.response)

    if (data.sources && data.sources.length > 0) {
      console.log("\n=== Sources ===")
      data.sources.forEach((source, index) => {
        console.log(`\n${index + 1}. Similarity: ${(source.score * 100).toFixed(1)}%`)
        console.log(`   Q: ${source.question}`)
        console.log(`   A: ${source.answer.substring(0, 100)}${source.answer.length > 100 ? "..." : ""}`)
      })
    }

    console.log(`\n=== Model: ${data.model} ===\n`)
  } catch (error) {
    console.error("Error:", error)
  }
}

// Example queries
async function main() {
  console.log("keLLeMes RAG Client Example\n")
  await chat("You from around here?")
  await chat("Any favorite movie?")
  await chat("I’m down for a coffee date there.")
  console.log("\n--- Testing without RAG ---")
  await chat("So, what’s your favorite way to spend a weekend?", false)
}

main()
