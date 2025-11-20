import { vi } from "vitest"
import { ragService } from "../../src/services/rag.service"

async function waitForRagReady() {
  try {
    await ragService.initialize()
  } catch (error) {
    console.error("Error initializing RAG service:", error.message)
    throw error
  }

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
