import ollama, { type ModelResponse } from "ollama"
import { useEffect, useState } from "react"
import { useStore } from "../store"

const REFRESH_INTERVAL_MS = 1000

/** Keeps track of the Ollama modelsß. */
export default function useOllamaModels({ enabled }: { enabled: boolean }) {
  const [models, setModels] = useState<ModelResponse[]>([])
  const setActiveModel = useStore(state => state.setActiveModel)

  useEffect(() => {
    const fetchModels = async () => {
      if (!enabled) return
      const result = await ollama.ps()
      setModels(result?.models ?? [])
      // If no models then no activly selected
      if (result?.models && result.models.length === 0) {
        setActiveModel(null)
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
