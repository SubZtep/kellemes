import { ragService } from "@kellemes/core"
import { useMutation } from "@tanstack/react-query"
import { Box, type BoxProps, useFocus } from "ink"
import { useState } from "react"
import PromptPanel from "../components/chat/PromptPanel"
import ResponsePanel from "../components/chat/ResponsePanel"
import { useStore } from "../store"

export default function ChatCenter(props: BoxProps) {
  const { isFocused } = useFocus()
  const { prompt, topK, useRAG, addResponse, setPrompt } = useStore()
  const [error, setError] = useState<string | null>(null)

  const generateResponse = async () => {
    if (useRAG) {
      return await ragService.generateResponse(prompt, topK)
    } else {
      const response = await ragService.generateDirectResponse(prompt)
      return { response }
    }
  }

  const { mutate: submitPrompt, isPending: isLoading } = useMutation({
    mutationFn: () => {
      addResponse({ model: process.env.MODEL!, sender: "user", createdAt: new Date(), response: prompt })
      return generateResponse()
    },
    onSuccess: data => {
      addResponse({ model: process.env.MODEL!, sender: "assistant", createdAt: new Date(), ...data })
      setPrompt("")
    },
    onError: error => {
      setError(error.message)
    },
  })

  return (
    <Box
      flexDirection="column"
      borderColor={isFocused ? "whiteBright" : "white"}
      borderStyle={isFocused ? "bold" : "round"}
      {...props}
    >
      <ResponsePanel isLoading={isLoading} error={error} />
      <PromptPanel submitPrompt={submitPrompt} isLoading={isLoading} />
    </Box>
  )
}
