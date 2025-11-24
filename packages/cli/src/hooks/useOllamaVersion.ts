import ollama from "ollama"
import { useEffect, useState } from "react"

const REFRESH_INTERVAL_MS = 500

/** Keeps track of the Ollama version. */
export default function useOllamaVersion() {
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const result = await ollama.version()
        setVersion(result?.version ?? null)
      } catch {
        setVersion(null)
      }
    }

    fetchVersion()
    const timer = setInterval(fetchVersion, REFRESH_INTERVAL_MS)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return version
}
