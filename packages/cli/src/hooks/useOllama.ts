import ollama from "ollama"
import { useEffect } from "react"
import { useStore } from "../store"

export default function useOllama() {
  const activeModel = useStore(state => state.activeModel)
  const prompt = useStore(state => state.prompt)
  const setPrompt = useStore(state => state.setPrompt)
  const addResponse = useStore(state => state.addResponse)

  const generateResponse = async (prompt: string) => {
    addResponse({
      model: activeModel!,
      sender: "user",
      createdAt: new Date(),
      response: prompt,
    })

    const response = await ollama.chat({
      model: activeModel!,
      stream: false,
      messages: [{ role: "user", content: prompt }],
    })

    console.log("Response:", response)

    addResponse({
      model: activeModel!,
      sender: response.message.role,
      response: response.message.content,
      createdAt: new Date(),
    })

    setPrompt("")
  }

  useEffect(() => {
    if (!prompt) return
    generateResponse(prompt)
    setPrompt("")
  }, [prompt])
}
