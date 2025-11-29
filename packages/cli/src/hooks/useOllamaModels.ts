import type { ModelResponse } from "ollama"
import { useEffect, useState } from "react"
import { ollama } from "../ollama"

const REFRESH_INTERVAL_MS = 1000

/**
 * Keeps track of the Ollama models
 *
 * @param enabled - Whether to fetch the models.
 */
export default function useOllamaModels({ enabled }: { enabled: boolean }) {
  const [models, setModels] = useState<ModelResponse[] | null>(null)

  useEffect(() => {
    const fetchModels = async () => {
      if (!enabled) return
      const result = await ollama.list()
      if (result.models && Array.isArray(result.models)) {
        setModels(result.models)
      } else {
        throw new Error("Listing models failed")
      }
    }

    fetchModels()
    const timer = setInterval(fetchModels, REFRESH_INTERVAL_MS)

    return () => {
      clearInterval(timer)
    }
  }, [enabled])

  return models
}
