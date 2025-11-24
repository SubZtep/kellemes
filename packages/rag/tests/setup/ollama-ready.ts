import ollama from "ollama/browser"
import { vi } from "vitest"

async function waitForOllamaReady() {
  if (await ollama.version()) {
    return
  }

  await vi.waitFor(
    async () => {
      if (!(await ollama.version())) {
        console.log("Ollama is not healthy yet")
      }
      console.log("Ollama is healthy now")
    },
    {
      timeout: 500,
      interval: 20,
    },
  )
}

await waitForOllamaReady()
