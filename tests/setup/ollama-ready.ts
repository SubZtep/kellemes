import { vi } from "vitest"
import { ollamaService } from "@kellemes/core"

async function waitForOllamaReady() {
  if (await ollamaService.checkHealth()) {
    return
  }

  await vi.waitFor(
    async () => {
      if (!(await ollamaService.checkHealth())) {
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
