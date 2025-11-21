import { ragService } from "@kellemes/core"
import { useMutation } from "@tanstack/react-query"
import { Box, type BoxProps, useFocus } from "ink"
import { useState } from "react"
import { useStore } from "../../store"
import PromptPanel from "../chat/PromptPanel"
import ResponsePanel from "../chat/ResponsePanel"

export default function ChatPanel(props: BoxProps) {
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
