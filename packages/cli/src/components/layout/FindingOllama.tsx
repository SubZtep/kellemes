import { Box, Text } from "ink"
import Gradient from "ink-gradient"
import Spinner from "ink-spinner"
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

  // useEffect(() => {
  //   return () => {
  //     // Gracefully abort the Ollama connection on exit
  //     // FIXME: test this
  //     ollama.abort()
  //   }
  // }, [])

  useEffect(() => {
    setOllamaVersion(version)
  }, [version])

  useEffect(() => {
    if (models === null) return
    setOllamaModels(models)
    if (models.length === 0) {
      setActiveModel(null)
    } else if (!activeModel && models.length === 1) {
      setActiveModel(models[0]!.model)
    }
  }, [models])

  if (ollamaVersion && models) {
    return <>{children}</>
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Gradient name="mind">
        <Spinner type="shark" />
        <Text bold>AI</Text>
        <Spinner type="binary" />
      </Gradient>
      <Box>
        <Text>Waiting for o</Text>
        <Text color="whiteBright" bold>
          LL
        </Text>
        <Text>a</Text>
        <Text color="whiteBright" bold>
          M
        </Text>
        <Text>a</Text>
        <Spinner type="simpleDots" />
      </Box>
    </Box>
  )
}
