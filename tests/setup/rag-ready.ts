import { vi } from "vitest"
import { ragService } from "../../src/services/rag.service"

async function waitForRagReady() {
  if (ragService.isReady()) {
    return
  }

  await vi.waitFor(
    () => {
      if (!ragService.isReady()) {
        console.log("RAG is not ready yet")
      }
      console.log("RAG is ready now")
    },
    {
      timeout: 500,
      interval: 20,
    },
  )
}

await waitForRagReady()

export {}
