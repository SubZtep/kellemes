import { Box, Text } from "ink"
import Gradient from "ink-gradient"
import Spinner from "ink-spinner"
import ollama from "ollama"
import { useEffect } from "react"
import useOllamaModels from "../../hooks/useOllamaModels"
import useOllamaVersion from "../../hooks/useOllamaVersion"
import { useStore } from "../../store"

/** This component ensures that the app does not load until Ollama is available. */
export default function FindingOllama({ children }: { children: React.ReactNode }) {
  const ollamaVersion = useStore(state => state.ollamaVersion)
  const setOllamaVersion = useStore(state => state.setOllamaVersion)
  const setOllamaModels = useStore(state => state.setOllamaModels)
  const activeModel = useStore(state => state.activeModel)
  const setActiveModel = useStore(state => state.setActiveModel)
  const version = useOllamaVersion()
  const models = useOllamaModels({ enabled: !!version })

  useEffect(() => {
    return () => {
      ollama.abort()
    }
  }, [])

  useEffect(() => {
    setOllamaVersion(version)
  }, [version])

  useEffect(() => {
    setOllamaModels(models)
    if (!activeModel && models.length === 1) {
      setActiveModel(models?.[0]?.model ?? null)
    }
  }, [models])

  if (ollamaVersion) {
    return <>{children}</>
  }

  return (
    <Box gap={1} flexDirection="column">
      <Gradient name="mind">
        <Spinner type="shark" />
        <Text bold>AI</Text>
        <Spinner type="binary" />
      </Gradient>
      <Text>
        Waiting for oLLaMa service
        <Spinner type="simpleDots" />
      </Text>
    </Box>
  )
}
