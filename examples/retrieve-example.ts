/**
 * Example: Retrieve relevant documents without generating a response
 *
 * Run with: node --experimental-strip-types examples/retrieve-example.ts
 */

interface RetrieveResponse {
  query: string
  results: Array<{
    question: string
    answer: string
    score: number
  }>
  count: number
}

async function retrieve(query: string, topK: number = 5): Promise<void> {
  try {
    const response = await fetch("http://localhost:3000/api/retrieve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        topK,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: RetrieveResponse = await response.json()

    console.log("\n=== Query ===")
    console.log(data.query)

    console.log(`\n=== Found ${data.count} relevant documents ===\n`)

    data.results.forEach((result, index) => {
      console.log(`${index + 1}. Similarity: ${(result.score * 100).toFixed(1)}%`)
      console.log(`   Question: ${result.question}`)
      console.log(`   Answer: ${result.answer}`)
      console.log("")
    })
  } catch (error) {
    console.error("Error:", error)
  }
}

async function main() {
  console.log("keLLeMes Document Retrieval Example\n")
  await retrieve("Any favorite movie?", 5)
  await retrieve("I’m down for a coffee date there.", 3)
  await retrieve("So, what’s your favorite way to spend a weekend?", 5)
}

main()
