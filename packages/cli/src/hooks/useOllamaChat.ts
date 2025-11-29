import ollama from "ollama"
import { useEffect, useState } from "react"
import { useStore } from "../store"

export default function useOllamaChat() {
  const activeModel = useStore(state => state.activeModel)
  const prompt = useStore(state => state.prompt)
  const setPrompt = useStore(state => state.setPrompt)
  const addResponse = useStore(state => state.addResponse)
  const [isLoading, setIsLoading] = useState(false)
  const [answer, setAnswer] = useState("")
  const { system_prompt, ...parameters } = useStore(state => state.parameters)

  const generateResponse = async (prompt: string) => {
    addResponse({
      model: activeModel!,
      sender: "user",
      createdAt: new Date(),
      response: prompt,
    })

    setIsLoading(true)

    // console.log(parameters)
    // @ts-ignore
    const stream = await ollama.chat({
      model: activeModel!,
      stream: true,
      messages: [
        ...(system_prompt ? [{ role: "system" as const, content: system_prompt }] : []),
        { role: "user", content: prompt },
      ],
      options: parameters,
    })

    let answerChunk = ""
    for await (const chunk of stream) {
      answerChunk += chunk.message.content
      setAnswer(answerChunk)

      if (chunk.done) {
        setIsLoading(false)
        setAnswer("")
        addResponse({
          model: activeModel!,
          sender: chunk.message.role,
          createdAt: new Date(),
          response: answerChunk,
        })
      }
    }
  }

  useEffect(() => {
    if (!prompt) return
    generateResponse(prompt)
    setPrompt("")
  }, [prompt])

  return { isLoading, response: answer }
}
