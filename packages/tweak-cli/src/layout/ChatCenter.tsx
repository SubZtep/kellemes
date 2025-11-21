import { ragService } from "@kellemes/core"
import { useMutation } from "@tanstack/react-query"
import { Box, useFocus } from "ink"
import { useState } from "react"
import QueryPanel from "../components/QueryPanel"
import ResponsePanel from "../components/ResponsePanel"
import { useStore } from "../store"

export default function ChatCenter() {
  const { isFocused } = useFocus()
  const { prompt, topK, useRAG, addResponse } = useStore()
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
    mutationFn: generateResponse,
    onSuccess: data => {
      addResponse({ model: process.env.MODEL!, ...data })
    },
    onError: error => {
      setError(error.message)
    },
  })

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      borderColor={isFocused ? "whiteBright" : "white"}
      borderStyle={isFocused ? "bold" : "round"}
    >
      <ResponsePanel isLoading={isLoading} error={error} />
      <QueryPanel submitPrompt={submitPrompt} isLoading={isLoading} />
    </Box>
  )
}
