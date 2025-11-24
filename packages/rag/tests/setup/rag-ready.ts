import { vi } from "vitest"
import { ragService } from "../../src/index"

async function waitForRagReady() {
  try {
    await ragService.initialize()
  } catch (error) {
    console.error("Error initializing RAG service:", error.message)
    throw error
  }

  if (await ragService.isReady()) {
    return
  }

  await vi.waitFor(
    async () => {
      if (!(await ragService.isReady())) {
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
