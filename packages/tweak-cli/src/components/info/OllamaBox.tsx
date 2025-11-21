import { Box, type BoxProps, Text } from "ink"
import ollama from "ollama/browser"
import { useEffect, useState } from "react"
import { useStore } from "../../store"
import SelectModel from "./SelectModel"

export default function OllamaBox({ isFocused = false, ...props }: { isFocused?: boolean } & BoxProps) {
  const activeModel = useStore(state => state.activeModel)
  const [ollamaVersion, setOllamaVersion] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const version = await ollama.version()
        setOllamaVersion(version.version)
      } catch (error: any) {
        throw new Error(`Ollama is unavailable: ${error.message}`)
      }
    })()
  }, [])

  return (
    <Box
      flexDirection="column"
      padding={isFocused ? 0 : 1}
      borderStyle={isFocused ? "bold" : undefined}
      borderColor="green"
      {...props}
    >
      <Box justifyContent="space-between">
        <Text>Ollama:</Text>
        <Text color="green">v{ollamaVersion}</Text>
      </Box>

      <Box justifyContent="space-between" gap={1}>
        <Text>Active model:</Text>
        <Text color="green" dimColor={!activeModel} bold={!!activeModel}>
          {activeModel ?? "t(-.-t)"}
        </Text>
      </Box>

      {isFocused && <SelectModel />}
    </Box>
  )
}
