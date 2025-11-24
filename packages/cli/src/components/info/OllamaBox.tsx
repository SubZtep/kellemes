import { TitledBox } from "@mishieck/ink-titled-box"
import { Box, type BoxProps, Text, useFocus } from "ink"
import ollama from "ollama/browser"
import { useEffect, useState } from "react"
import { useStore } from "../../store"
import SelectModel from "./SelectModel"

export default function OllamaBox({ ...props }: Pick<BoxProps, "flexGrow">) {
  const activeModel = useStore(state => state.activeModel)
  const { isFocused } = useFocus({ autoFocus: !activeModel, id: "ollamabox" })
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
    <TitledBox
      titles={["Ollama", ollamaVersion ?? "t(-.-t)"]}
      borderStyle={"round"}
      padding={1}
      flexDirection="column"
      borderDimColor={!isFocused}
      {...props}
    >
      {!isFocused && (
        <Box justifyContent="space-between" gap={1}>
          <Text>LLM:</Text>
          <Text color="green" dimColor={!activeModel} bold={!!activeModel}>
            {activeModel ?? "t(-.-t)"}
          </Text>
        </Box>
      )}

      {isFocused && <SelectModel />}
    </TitledBox>
  )
}
