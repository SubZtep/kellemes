import ollama from "ollama"
import { useState } from "react"

export default function useOllamaCreate(baseModel: string) {
  const [isLoading, setIsLoading] = useState(false)

  const create = async (parameters: Record<string, number | string>) => {
    setIsLoading(true)
    const response = await ollama.create({
      from: baseModel,
      model: process.env.OLLAMA_MODEL,
      parameters,
      stream: false,
    })
    setIsLoading(false)
    return response
  }

  return { isLoading, create }
}
