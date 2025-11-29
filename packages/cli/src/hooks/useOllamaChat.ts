import type { AbortableAsyncIterator } from "ollama"
import { useEffect, useRef, useState } from "react"
import { ollama } from "../ollama"
import { type ChatMessage, useStore } from "../store"

export default function useOllamaChat() {
  const activeModel = useStore(state => state.activeModel)
  const prompt = useStore(state => state.prompt)
  const setPrompt = useStore(state => state.setPrompt)
  const addResponse = useStore(state => state.addResponse)
  const [isLoading, setIsLoading] = useState(false)
  const [answer, setAnswer] = useState("")
  const { system_prompt, ...parameters } = useStore(state => state.parameters)
  const chatStream = useRef<AbortableAsyncIterator<ChatMessage> | null>(null)

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

    // @ts-ignore
    chatStream.current = stream

    let answerChunk = ""
    try {
      for await (const chunk of stream) {
        answerChunk += chunk.message.content
        setAnswer(answerChunk)

        if (chunk.done) {
          addResponse({
            model: activeModel!,
            sender: chunk.message.role,
            createdAt: new Date(),
            response: answerChunk,
          })
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        addResponse({
          model: activeModel!,
          sender: "assistant",
          createdAt: new Date(),
          response: `${answerChunk}☠`,
        })
      } else {
        console.log("Failed to generate response: ", error.message)
      }
    } finally {
      setIsLoading(false)
      setAnswer("")
    }
  }

  useEffect(() => {
    if (!prompt) return
    generateResponse(prompt)
    setPrompt("")
  }, [prompt])

  return { isLoading, response: answer, stream: chatStream.current }
}
