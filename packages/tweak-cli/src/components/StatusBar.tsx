import { ollamaService, ragService } from "@kellemes/core"
import { Box, Text } from "ink"
import { useEffect, useState } from "react"

type OllamaStatus = "connected" | "disconnected" | "checking"
type RAGStatus = "ready" | "not ready" | "initializing"

export default function StatusBar() {
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>("checking")
  const [ragStatus, setRAGStatus] = useState<RAGStatus>("initializing")
  const [documentsCount, setDocumentsCount] = useState(0)

  const ollamaColor = ollamaStatus === "connected" ? "green" : ollamaStatus === "checking" ? "yellow" : "red"
  const ragColor = ragStatus === "ready" ? "green" : ragStatus === "initializing" ? "yellow" : "red"

  useEffect(() => {
    const initialize = async () => {
      // Check Ollama
      const healthy = await ollamaService.checkHealth()
      setOllamaStatus(healthy ? "connected" : "disconnected")

      // Initialize RAG
      await ragService.initialize()
      const stats = ragService.getStats()
      setRAGStatus(stats.isReady ? "ready" : "not ready")
      setDocumentsCount(stats.totalDocuments)
    }

    initialize()
  }, [])

  return (
    <Box flexDirection="column" paddingX={2} flexGrow={1}>
      <Box justifyContent="space-between">
        <Text>Ollama:</Text>
        <Text color={ollamaColor}>{ollamaStatus}</Text>
      </Box>
      <Box justifyContent="space-between">
        <Text>RAG:</Text>
        <Text color={ragColor}>{ragStatus}</Text>
      </Box>
      <Box justifyContent="space-between">
        <Text>Documents:</Text>
        <Text color="cyan">{documentsCount}</Text>
      </Box>
    </Box>
  )
}
