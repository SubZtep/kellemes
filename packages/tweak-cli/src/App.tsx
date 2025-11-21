import { ollamaService, ragService, type SearchResult } from "@kellemes/core"
import { Box, Text, useApp, useInput } from "ink"
import { useEffect, useState } from "react"
import { ParameterPanel, type Parameters } from "./components/ParameterPanel"
import { QueryPanel } from "./components/QueryPanel"
import { ResponsePanel } from "./components/ResponsePanel"
import { StatusBar } from "./components/StatusBar"

type OllamaStatus = "connected" | "disconnected" | "checking"
type RAGStatus = "ready" | "not ready" | "initializing"

export const App: React.FC = () => {
  const { exit } = useApp()

  // System status
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>("checking")
  const [ragStatus, setRAGStatus] = useState<RAGStatus>("initializing")
  const [documentsCount, setDocumentsCount] = useState(0)

  // Parameters
  const [params, setParams] = useState<Parameters>({
    topK: 3,
    similarityThreshold: 0.5,
    temperature: 0.7,
    useRAG: true,
  })
  const [selectedParam, setSelectedParam] = useState(0)

  // Query and response
  const [query, setQuery] = useState("")
  const [queryInputActive, setQueryInputActive] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [sources, setSources] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize services
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

  // Handle query submission
  const handleSubmitQuery = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)
    setResponse(null)
    setSources([])

    try {
      if (params.useRAG) {
        const result = await ragService.generateResponse(query, params.topK)
        setResponse(result.response)
        setSources(result.sources)
      } else {
        const result = await ragService.generateDirectResponse(query)
        setResponse(result)
        setSources([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  // Keyboard input handling
  useInput((input: string, key: any) => {
    // Query input is active - let TextInput handle it
    if (queryInputActive) {
      if (key.escape) {
        setQueryInputActive(false)
      }
      return
    }

    // Global commands
    if (input === "q" || input === "Q") {
      exit()
      return
    }

    // Activate query input
    if (key.return) {
      setQueryInputActive(true)
      return
    }

    // Navigate parameters
    if (key.upArrow) {
      setSelectedParam(prev => Math.max(0, prev - 1))
      return
    }

    if (key.downArrow) {
      setSelectedParam(prev => Math.min(3, prev + 1))
      return
    }

    // Adjust parameters
    if (key.leftArrow || key.rightArrow) {
      const delta = key.rightArrow ? 1 : -1

      setParams(prev => {
        const updated = { ...prev }

        switch (selectedParam) {
          case 0: // Top-K
            updated.topK = Math.max(1, Math.min(10, prev.topK + delta))
            break
          case 1: // Similarity threshold
            updated.similarityThreshold = Math.max(0, Math.min(1, prev.similarityThreshold + delta * 0.1))
            break
          case 2: // Temperature
            updated.temperature = Math.max(0, Math.min(2, prev.temperature + delta * 0.1))
            break
          case 3: // RAG mode (toggle with space)
            break
        }

        return updated
      })
    }

    // Toggle RAG mode
    if (input === " " && selectedParam === 3) {
      setParams(prev => ({ ...prev, useRAG: !prev.useRAG }))
    }
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          keLLeMes Tweak CLI - Interactive Parameter Tuning
        </Text>
      </Box>
      {/* <Logo /> */}

      <StatusBar ollamaStatus={ollamaStatus} ragStatus={ragStatus} documentsCount={documentsCount} />

      <Box marginTop={1}>
        <Box flexDirection="column" width="40%" marginRight={1}>
          <ParameterPanel params={params} selectedParam={selectedParam} />
          <Box marginTop={1}>
            <QueryPanel
              query={query}
              onQueryChange={setQuery}
              onSubmit={handleSubmitQuery}
              isActive={queryInputActive}
            />
          </Box>
        </Box>

        <Box flexDirection="column" width="60%">
          <ResponsePanel response={response} sources={sources} isLoading={isLoading} error={error} />
        </Box>
      </Box>

      <Box marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
        <Text dimColor>
          Tip: Use ↑/↓ to navigate, ←/→ to adjust values, Space to toggle, Enter to input query, Q to quit
        </Text>
      </Box>
    </Box>
  )
}
