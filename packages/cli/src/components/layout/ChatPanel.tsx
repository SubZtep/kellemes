// import { ragService } from "@kellemes/core"
import { useMutation } from "@tanstack/react-query"
import { Box, type BoxProps } from "ink"
import ollama from "ollama/browser"
import { useState } from "react"
import { useStore } from "../../store"
import PromptBox from "../chat/PromptBox"
import ResponseBox from "../chat/ResponseBox"

export default function ChatPanel(props: BoxProps) {
  // const prompt = useStore(state => state.prompt)
  // const topK = useStore(state => state.topK)
  // const useRAG = useStore(state => state.useRAG)
  const activeModel = useStore(state => state.activeModel)
  const addResponse = useStore(state => state.addResponse)
  const setPrompt = useStore(state => state.setPrompt)
  const [error, setError] = useState<string | null>(null)

  const generateResponse = async (prompt: string) => {
    // if (useRAG) {
    //   return await ragService.generateResponse(prompt, topK)
    // } else {
    //   const response = await ragService.generateDirectResponse(prompt)
    //   return { response }
    // }
    const response = await ollama.chat({
      model: activeModel!,
      stream: false,
      messages: [{ role: "user", content: prompt }],
    })
    setPrompt(`xxx${response.message.content}xxx`)
    return { response: response.message.content, sender: response.message.role as any }
  }

  const { mutate: submitPrompt, isPending: isLoading } = useMutation({
    mutationFn: (prompt: string) => {
      addResponse({
        model: activeModel!,
        sender: "user",
        createdAt: new Date(),
        response: prompt,
      })
      return generateResponse(prompt)
    },
    onSuccess: data => {
      addResponse({
        model: activeModel!,
        // sender: "assistant",
        createdAt: new Date(),
        ...data,
      })
      setPrompt("")
    },
    onError: error => {
      setError(error.message)
    },
  })

  return (
    <Box flexDirection="column" {...props}>
      <ResponseBox isLoading={isLoading} error={error} />
      <PromptBox submitPrompt={submitPrompt} isLoading={isLoading} />
    </Box>
  )
}
